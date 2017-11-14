import { h , Component } from "preact";
import { string, func } from "prop-types";

import {
  shapefileFor,
  sourceLayerFor,
  areaKeyFor,
} from "../constants/map";

export default class Map extends Component {

  static propTypes = {
    geography: string,
    setArea: func.isRequired,
  }

  state = {
    sources: [],
  }

  componentWillReceiveProps(nextProps) {
    const { geography, area } = nextProps;
    const { geography: oldGeography } = this.props;

    if (geography) { 
      this.addSource(geography);
      this.map.setFilter(`${geography}-selected`, ["==", areaKeyFor(geography), area || ""]);
    }

    if ((!geography && oldGeography) || (oldGeography && (geography !== oldGeography))) {
      this.map.setFilter(`${oldGeography}-selected`, ["==", areaKeyFor(oldGeography), ""])
    }

    this.makeSourceVisible(geography);
  }

  componentDidMount() {
    window.mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";
    this.map = new window.mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [ -77.0675577, 38.890812 ],
      zoom: 11,
    });
  }

  addSource = (id) => {
    if (!this.map) return;
    if (this.map.getSource(id)) return;

    const url = shapefileFor(id);
    if (!url) throw new Error(`invalid geography '${id}'`);

    this.map.addSource(id, {
      type: "vector",
      url,
    });

    this.addLayers(id);

    this.setState({
      sources: [ ...this.state.sources, id ],
    });
  }

  addLayers = (id) => {
    if (!this.map) return;
    if (!this.map.getSource(id)) return;

    this.map.addLayer({
      id: `${id}-lines`,
      type: "line",
      source: id,
      "source-layer": sourceLayerFor(id),
      paint: {
        "line-width": 2,
        "line-color": "#cc0000",
      },
    });

    this.map.addLayer({
      id: `${id}-fills`,
      type: "fill",
      source: id,
      "source-layer": sourceLayerFor(id),
      paint: {
        "fill-opacity": 0.0,
        "fill-color": "#ffffff",
      },
    });

    this.map.addLayer({
      id: `${id}-hover`,
      type: "fill",
      source: id,
      "source-layer": sourceLayerFor(id),
      paint: {
        "fill-opacity": 0.3,
        "fill-color": "#cc0000",
      },
      layout: {
        visibility: "visible",
      },
      filter: [ "==", areaKeyFor(id), "" ],
    });

    this.map.addLayer({
      id: `${id}-selected`,
      type: "fill",
      source: id,
      "source-layer": sourceLayerFor(id),
      paint: {
        "fill-opacity": 0.3,
        "fill-color": "#0000cc",
      },
      layout: {
        visibility: "visible",
      },
      filter: [ "==", areaKeyFor(id), "" ],
    })

    this.map.on("click", `${id}-fills`, (ev) => {
      const key = areaKeyFor(id);
      const newArea = ev.features[0].properties[key];
      this.props.setArea(newArea === this.props.area ? null : newArea);
    })

    this.map.on("mousemove", `${id}-fills`, (ev) => {
      const key = areaKeyFor(id);
      this.map.setFilter(`${id}-hover`, ["==", key, ev.features[0].properties[key]]);
    });

    this.map.on("mouseleave", `${id}-fills`, (ev) => {
      const key = areaKeyFor(id);
      this.map.setFilter(`${id}-hover`, ["==", key, ""]);
    });
  }

  makeSourceVisible = (id) => {
    this.state.sources.forEach(source => {
      [ "lines", "fills" ].forEach(layer => {
        this.map.setLayoutProperty(`${source}-${layer}`, "visibility", "none");
      })
    });

    if (!id) return;

    [ "lines", "fills" ].forEach(layer => {
      this.map.setLayoutProperty(`${id}-${layer}`, "visibility", "visible");
    })
  }

  render() {
    return (
      <div className="Map">
        <div class="container">
          <div id="map" />
          <a className="Map-embed" href="#">&lt;/&gt; Embed</a>
        </div>
      </div>
    );
  }

}
