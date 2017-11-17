import { h , Component } from "preact";
import { func, object } from "prop-types";

import {
  shapefile,
  sourceLayer,
  areaKey,
} from "../support/map";

import {
  choroplethRows,
  choroplethColor,
  rowKey,
  indicatorLabel,
} from "../lib/data";

import {
  equal,
} from "../lib/classifiers";

import {
  blueColorRamp,
} from "../constants/colors";

// in order, add the following layers:
//
// invisible areas for hover events
// hover indicator
// selected area
// choropleth (only visible when an indicator is selected)
// delimiting lines
const layers = (geography) => ([
  { id: `${geography}-fills`, type: "fill", paint: { "fill-opacity": 0, "fill-color": "#ffffff" } },
  { id: `${geography}-hover`, type: "fill", paint: { "fill-opacity": 0.3, "fill-color": "#cc0000" }, filter: [ "==", areaKey(geography), "" ] },
  { id: `${geography}-choropleth`, type: "fill", paint: { "fill-opacity": 0.9 }, layout: { visibility: "none" } },
  { id: `${geography}-selected`, type: "fill", paint: { "fill-opacity": 0.3, "fill-color": "#cc0000" }, filter: [ "==", areaKey(geography), "" ] },
  { id: `${geography}-lines`, type: "line", paint: { "line-width": 1, "line-color": "rgba(0, 0, 0, 0.7)" } },
]);

export default class Map extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  static propTypes = {
    filters: object,
    setArea: func.isRequired,
    data: object,
    metadata: object,
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  state = {
    sources: [],
    choropleths: {},
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

  componentWillReceiveProps(nextProps) {
    const { filters: { geography, indicator, year }, area, data } = nextProps;
    const { filters: { geography: oldGeography } } = this.props;

    if (geography) {
      this.addSource(geography);
      this.map.setFilter(`${geography}-selected`, ["==", areaKey(geography), area || ""]);
    }

    if ((!geography && oldGeography) || (oldGeography && (geography !== oldGeography))) {
      this.map.setFilter(`${oldGeography}-selected`, ["==", areaKey(oldGeography), ""])
    }

    this.makeSourceVisible(geography);
    this.setChoropleth(data, geography, indicator, year);
  }


  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  addSource = (geography) => {
    if (!this.map) return;
    if (this.map.getSource(geography)) return;

    const url = shapefile(geography);
    if (!url) throw new Error(`invalid geography '${geography}'`);

    this.map.addSource(geography, {
      type: "vector",
      url,
    });

    this.addLayers(geography);

    this.setState({
      sources: [ ...this.state.sources, geography ],
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  addLayers = (geography) => {
    if (!this.map) return;
    if (!this.map.getSource(geography)) return;

    layers(geography).forEach(layer => {
      this.map.addLayer({
        ...layer,
        ...{
          source: geography,
          "source-layer": sourceLayer(geography),
        },
      })
    });

    // select area
    this.map.on("click", `${geography}-fills`, (ev) => {
      const key = areaKey(geography);
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

    // show hide current area on mousemove / leave
    this.map.on("mousemove", `${geography}-fills`, (ev) => {
      const key = areaKey(geography);
      this.map.setFilter(`${geography}-hover`, ["==", key, ev.features[0].properties[key]]);
    });

    this.map.on("mouseleave", `${geography}-fills`, () => {
      const key = areaKey(geography);
      this.map.setFilter(`${geography}-hover`, ["==", key, ""]);
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  makeSourceVisible = (geography) => {
    this.state.sources.forEach(source => {
      [ "lines", "fills", "choropleth" ].forEach(layer => {
        this.map.setLayoutProperty(`${source}-${layer}`, "visibility", "none");
      })
    });

    if (!geography) return;

    [ "lines", "fills" ].forEach(layer => {
      this.map.setLayoutProperty(`${geography}-${layer}`, "visibility", "visible");
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setChoropleth = (data, geography, indicator, year) => {
    if (!data || !geography || !indicator) return;

    const indicatorKey = rowKey(geography);
    const colorForRow = choroplethColor(data, geography, indicator, year);
    const stops = choroplethRows(data, year).map(row => (
      [ row[indicatorKey].toString(), colorForRow(row) ]
    ));

    this.map.setPaintProperty(`${geography}-choropleth`, "fill-color", {
      property: areaKey(geography),
      type: "categorical",
      stops: stops
    });
    this.map.setLayoutProperty(`${geography}-choropleth`, "visibility", "visible");
  }

  render() {
    const { filters: { indicator, year }, data, metadata } = this.props;
    const legendCx = indicator ? "Map-legend visible" : "Map-legend";

    const steps = equal((choroplethRows(data, year) || []).map(r => r[indicator]));

    return (
      <div className="Map">
        <div class="container">
          <div className={legendCx}>
            <h3>{indicator && metadata && indicatorLabel(indicator, metadata)}</h3>
            <ul>
              {blueColorRamp.map((color, step) => (
                <li>
                  <span class="color" style={{ backgroundColor: color }} />
                  <span class="legend">≤ {steps[step].toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div id="map" />
          <a className="Map-embed" href="#">&lt;/&gt; Embed</a>
        </div>
      </div>
    );
  }

}
