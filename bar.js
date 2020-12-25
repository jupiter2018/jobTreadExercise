class Bar extends React.Component {
  state = { responses: [0,0,0,0,0,0,0,0,0,0], responseTimes:[] };
  updateResponses = (arr, time) => {
    arr.shift();
    arr.push(time);
    return arr;
  };
  getResponseTime = () => {
    let startTime = Date.now();
    let responseTime = 0;
    fetch("https://api.jobtread.com/healthz")
      .then((res) => {
        let endTime = Date.now();
        responseTime = endTime - startTime;
        let newArr = [...this.state.responses];
        let updatedArray = this.updateResponses(newArr, responseTime);
        this.setState({ responses: updatedArray });
      })
      .catch((err) => {
        console.log(err);
      });
  };
    findMean = () => {
        return this.state.responses.reduce((arr,currentValue)=>arr+currentValue)/10
    }
  componentDidMount() {
    this.startGettingResponse = setInterval(this.getResponseTime, 1000);
  }
  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.startGettingResponse);
  }
  render() {
    // console.log(displayTimes)
    return (
      <div>
            <h1>Response Times Bar Graph</h1>
            <h3>Mean: { this.findMean()}</h3>
        {this.state.responses.map((time) => {
          let count = time * 10 + "px";
          let divStyle = { width: count };

          return (
            <div key={Math.random() * 10000}>
              <div style={divStyle} className="graph">
                <p>{time}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
class Histogram extends React.Component {
  state = { responseTimes: [] };
  getResponseTime = () => {
    let startTime = Date.now();
    let responseTime = 0;
    fetch("https://api.jobtread.com/healthz")
      .then((res) => {
        let endTime = Date.now();
        responseTime = endTime - startTime;

          if (this.state.responseTimes.length > 0) {
            
          
          let responseTimeExist = this.state.responseTimes.find((curTime) =>
            curTime.hasOwnProperty(responseTime)
          );
          if (responseTimeExist) {
            let updateResponseTimes = this.state.responseTimes.map((curTime) => {
              if (curTime.hasOwnProperty(responseTime)) {
                let count = curTime[responseTime];
                return { [responseTime]: count + 1 };
              }
              return curTime;
            });
            this.setState((state) => ({ responseTimes: updateResponseTimes.length>10?updateResponseTimes.slice(updateResponseTimes-10):updateResponseTimes }));
          } else {
              this.setState((state) => {
                  let newCopy = []
                  if (state.responseTimes.length >= 10) {
                      newCopy = state.responseTimes.slice(state.responseTimes.length - 9)
                      newCopy.push({[responseTime]:1})
                  }
                  else {
                      newCopy = [...state.responseTimes,{[responseTime]:1}]
                  }
                  return {responseTimes:newCopy}
              
            });
          }
        } else {
          this.setState((state) => ({
            responseTimes: [{ [responseTime]: 1 }],
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    this.startGettingResponse = setInterval(this.getResponseTime, 1000);
  }
  componentWillUnmount() {
    // Clear the interval right before component unmount
    clearInterval(this.startGettingResponse);
  }
  render() {
    //console.log(this.state.responseTimes.length)
    return (
      <div>
        <h1>Response Times Histogram</h1>
        {this.state.responseTimes.map((time) => {
          let count = Object.values(time)[0] * 20 + "px";
          let divStyle = { width: count };

          return (
            <div key={Math.random() * 10000}>
              <div style={divStyle} className="graph">
                <p>{Object.keys(time)[0]}</p>
              </div>
              <div className="paraDiv">
                <p>{count}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

class App extends React.Component{
    render() {
        return(
        <React.Fragment>
            <Bar />
            <hr />
            <Histogram/>
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"));
















