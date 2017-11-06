import { h, Component } from "preact"

export default class DataList extends Component {

  render() {
    return (
      <div className="DataTable">
        <div className="container">

          <div class="DataTable-actions">
            <button>📄 Download Data</button>
            <a href="#">Sources and Notes</a>
          </div>

          <table>
            <thead>
              <tr>
                <td>Tract XYZ</td>
                <td>This tract</td>
                <td colSpan="3">All Tracts in DC</td>
              </tr>
              <tr>
                <td colSpan="2"></td>
                <td>Average</td>
                <td>Low</td>
                <td>High</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="indicator">Foreign Born</td>
              </tr>

              {[0,1,2,3,4].map(row => (
                <tr key={row}>
                  <td>% foreign born, 1980</td>
                  <td>1.9</td>
                  <td>6.4</td>
                  <td>0.0</td>
                  <td>38</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
    );
  }
}
