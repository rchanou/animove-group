import React from 'react/addons';

import Movable from '../component/movable.jsx';


class Demo extends React.Component {

  state = { shifted: false };

  render(){
    return <div onClick={this._onClick.bind(this)}>
      {this.state.shifted && <div>buyakasha</div>}

      <Movable
        style={{ WebkitTransition: 'all 1s ease-out', transition: 'all 1s ease-out', backgroundColor: 'hsl(180,50%,50%)' }}
      >
        Sup
      </Movable>
    </div>;
  }

  _onClick(){
    this.setState({ shifted: !this.state.shifted });
  }

  componentDidMount(){
    setTimeout(() => {
      this.forceUpdate();
    }.bind(this), 5000);
  }

}


React.render(<Demo />, document.body);
