import React from 'react/addons';

import Movable from '../component/movable.jsx';


class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = { shifted: false };
  }

  render(){
    return <div onClick={this._onClick}>
      {this.state.shifted && <div>buyakasha</div>}
      <Movable element='div'>
        Sup
      </Movable>
    </div>;
  }

  _onClick(){
    this.setState({ shifted: !this.state.shifted });
  }

}


React.render(<Demo />, document.body);
