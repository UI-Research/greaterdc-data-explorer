import { h , Component } from "preact";
import { string, func } from "prop-types";

import {
  shapefile,
  sourceLayer,
  areaKey,
} from "../support/map";

export default class Map extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  static propTypes = {
    geography: string,
    setArea: func.isRequired,
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  state = {
    sources: [],
  }

  componentWillReceiveProps(nextProps) {
    const { geography, area } = nextProps;
    const { geography: oldGeography } = this.props;

    if (geography) { 
      this.addSource(geography);
      this.map.setFilter(`${geography}-selected`, ["==", areaKey(geography), area || ""]);
    }

    if ((!geography && oldGeography) || (oldGeography && (geography !== oldGeography))) {
      this.map.setFilter(`${oldGeography}-selected`, ["==", areaKey(oldGeography), ""])
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

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  addSource = (id) => {
    if (!this.map) return;
    if (this.map.getSource(id)) return;

    const url = shapefile(id);
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

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  addLayers = (id) => {
    if (!this.map) return;
    if (!this.map.getSource(id)) return;

    this.map.addLayer({
      id: `${id}-lines`,
      type: "line",
      source: id,
      "source-layer": sourceLayer(id),
      paint: {
        "line-width": 2,
        "line-color": "#cc0000",
      },
    });

    this.map.addLayer({
      id: `${id}-fills`,
      type: "fill",
      source: id,
      "source-layer": sourceLayer(id),
      paint: {
        "fill-opacity": 0.0,
        "fill-color": "#ffffff",
      },
    });

    this.map.addLayer({
      id: `${id}-hover`,
      type: "fill",
      source: id,
      "source-layer": sourceLayer(id),
      paint: {
        "fill-opacity": 0.3,
        "fill-color": "#cc0000",
      },
      layout: {
        visibility: "visible",
      },
      filter: [ "==", areaKey(id), "" ],
    });

    this.map.addLayer({
      id: `${id}-selected`,
      type: "fill",
      source: id,
      "source-layer": sourceLayer(id),
      paint: {
        "fill-opacity": 0.3,
        "fill-color": "#0000cc",
      },
      layout: {
        visibility: "visible",
      },
      filter: [ "==", areaKey(id), "" ],
    })

    this.map.on("click", `${id}-fills`, (ev) => {
      const key = areaKey(id);
      const newAreaProps = ev.features[0].properties;
      const newArea = newAreaProps[key];

      this.map.easeTo({ center: [ev.lngLat.lng, ev.lngLat.lat], zoom: 12 });

      if (newArea === this.props.area) {
        this.props.setArea(null, null);
      }
      else {
        this.props.setArea(newArea, newAreaProps);
      }
    })

    this.map.on("mousemove", `${id}-fills`, (ev) => {
      const key = areaKey(id);
      this.map.setFilter(`${id}-hover`, ["==", key, ev.features[0].properties[key]]);
    });

    this.map.on("mouseleave", `${id}-fills`, () => {
      const key = areaKey(id);
      this.map.setFilter(`${id}-hover`, ["==", key, ""]);
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
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
