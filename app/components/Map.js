import { h , Component } from "preact";
import { func, object } from "prop-types";
import classnames from "classnames";

import Filters from './Filters';

import {
  shapefile,
  sourceLayer,
  areaKey,
} from "../support/map";

import {
  areaLabel,
} from "../support/data_table";

import {
  indicatorLabel,
  formatNumber,
  areaValue,
} from "../lib/data";

import {
  blueColorRamp,
} from "../constants/colors";

import {
  geographies,
} from "../constants/taxonomy";

// in order, add the following layers:
//
// invisible areas for hover events
// hover indicator
// selected area
// choropleth (only visible when an indicator is selected)
// area lines
const layers = (geography) => ([
  { id: `${geography}-fills`, type: "fill", paint: { "fill-opacity": 0, "fill-color": "#ffffff" } },
  { id: `${geography}-choropleth`, type: "fill", paint: { "fill-opacity": 0.7 }, layout: { visibility: "none" } },
  { id: `${geography}-hover`, type: "fill", paint: { "fill-opacity": 0.4, "fill-color": "#fbb755" }, filter: [ "==", areaKey(geography), "" ] },
  { id: `${geography}-selected`, type: "fill", paint: { "fill-opacity": 0.7, "fill-color": "#fbb755" }, filter: [ "==", areaKey(geography), "" ] },
  { id: `${geography}-lines`, type: "line", paint: { "line-width": 1, "line-color": "rgba(0, 0, 0, 0.4)" } },
]);

export default class Map extends Component {

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  static propTypes = {
    onLoad: func.isRequired,
    selectedFilters: object,
    setArea: func.isRequired,
    toggleAreaLock: func.isRequired,
    data: object,
    metadata: object,
    onAboutAppClick: func.isRequired,
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  state = {
    sources: [],
    choropleths: {},
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  loadedSources = [];

  componentDidMount() {
    const { mapboxgl } = window;

    mapboxgl.accessToken = "pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ";
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      center: [ -77.0675577, 38.890812 ],
      zoom: 11,
    });

    this.map.scrollZoom.disable();
    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

    this.map.on("load", this.props.onLoad);
    this.map.on("data", this.handleMapData);
  }

  componentWillReceiveProps(nextProps) {
    const { geography: oldGeography, indicator: oldIndicator, year: oldYear } = this.props.selectedFilters;
    const { selectedFilters: { geography, indicator, year }, choroplethColorStops } = nextProps;

    // geography chosen
    if (geography && geography !== oldGeography) {
      if (this.loadedSources.includes(geography)) {
        this.makeSourceVisible(geography)
      }
      else {
        this.addSource(geography);
      }
    }

    // geography cleared
    if (!geography && geography !== oldGeography) {
      this.makeSourceVisible(null);
    }

    // indicator chosen or year changed
    if (
      (indicator && indicator !== oldIndicator && this.loadedSources.includes(geography)) ||
      (year && year !== oldYear && this.loadedSources.includes(geography))
    ) {
      this.setChoropleth(geography, choroplethColorStops);
    }

    // year cleared
    if (!year && year !== oldYear && this.loadedSources.includes(geography)) {
      this.clearChoropleth(geography);
    }
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  addSource = (geography) => {
    const url = shapefile(geography);
    if (!url) {
      throw new Error(`invalid geography: ${geography}`);
    }

    this.map.addSource(geography, {
      type: "vector",
      url,
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  addLayers = (geography) => {
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
      const { areaLocked, area, toggleAreaLock } = this.props;
      const newArea = ev.features[0].properties[areaKey(geography)];

      if (area !== newArea) {
        this.setArea(geography, ev);
        if (!areaLocked) toggleAreaLock();
      } else {
        toggleAreaLock();
      }
    })

    // show hide current area on mousemove / leave
    this.map.on("mousemove", `${geography}-fills`, (ev) => {
      if (this.props.areaLocked) return;
      this.setArea(geography, ev);
    });

    this.map.on("mouseleave", `${geography}-fills`, () => {
      if (this.props.areaLocked) return;

      const key = areaKey(geography);
      this.map.setFilter(`${geography}-hover`, ["==", key, ""]);
    });
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setArea = (geography, ev) => {
    const key = areaKey(geography);
    const newAreaProps = ev.features[0].properties;
    const newArea = newAreaProps[key];

    this.map.setFilter(`${geography}-hover`, ["==", key, ev.features[0].properties[key]]);
    this.props.setArea(newArea, newAreaProps);
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  setChoropleth = (geography, colorStops) => {
    if (!geography || colorStops.length === 0) return;

    this.map.setPaintProperty(`${geography}-choropleth`, "fill-color", {
      property: areaKey(geography),
      type: "categorical",
      stops: colorStops,
      default: "rgba(255, 255, 255, 0)",
    });
    this.map.setLayoutProperty(`${geography}-choropleth`, "visibility", "visible");
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  clearChoropleth = (geography) => {
    if (!geography) return;
    this.map.setLayoutProperty(`${geography}-choropleth`, "visibility", "none");
  }

  // https://github.com/babel/babel-eslint/issues/487
  // eslint-disable-next-line no-undef
  makeSourceVisible = (geography) => {
    this.loadedSources.forEach(source => {
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
  handleMapData = (ev) => {
    if (!ev.sourceId) return;
    if (this.loadedSources.includes(ev.sourceId) || !geographies.hasOwnProperty(ev.sourceId)) return;

    if (ev.isSourceLoaded) {
      this.loadedSources.push(ev.sourceId);
      this.addLayers(ev.sourceId);
      this.makeSourceVisible(ev.sourceId);

      if (this.props.indicator || this.props.year) {
        this.setChoropleth(this.props.geography, this.props.choroplethColorStops);
      }
    }
  }

  render() {
    const {
      area, areaProps,
      choroplethSteps,
      clearFilters,
      data,
      filters,
      metadata,
      selectedFilters,
      selectedFilters: { geography, indicator, year },
      setFilter,
      notesAndSources,
      onAboutAppClick,
    } = this.props;

    const stepsCount = indicator && year
      ? choroplethSteps.length
      : 0;

    const largeValues = indicator && year
      ? parseInt(choroplethSteps[stepsCount - 1]).toString().length * stepsCount > 20
      : false;

    const legendCx = classnames("Map-legend", {
      "large-values": largeValues,
    });

    return (
      <div className="Map">
        <div id="map" style={{height: 'calc(100vh + 50px)'}}>
          <div class="container">
            <Filters
              filters={filters}
              selectedFilters={selectedFilters}
              setFilter={setFilter}
              clearFilters={clearFilters}
              data={data}
              metadata={metadata}
              notesAndSources={notesAndSources}
              onInfoClick={this.props.onInfoClick}
            />

            <div className={legendCx}>
              <small>{indicator ? (indicator && metadata && indicatorLabel(indicator, metadata)) : "Select an Indicator"}</small>
              <dl>
                <dt>
                  <h3 class="h4">{area ? areaLabel(geography, areaProps) : "Hover area (click to lock)"}</h3>
                </dt>
                <dd>{areaValue(data, area, geography, indicator, year)}</dd>
              </dl>
              {indicator && year && (
                <ul className="Map-key">
                  {choroplethSteps.map((_, step) => (
                    <li key={step}>
                      <span class="key-values">≤ {formatNumber(choroplethSteps[step])}</span>
                      <span class="color" style={{ backgroundColor: blueColorRamp[step] }} />
                    </li>

                  ))}
                </ul>
              )}

              <span className="Map-legend-about-app" onClick={onAboutAppClick} role="button">About this app</span>

            </div>

          </div>
        </div>
      </div>
    );
  }

}
