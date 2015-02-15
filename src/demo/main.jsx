import React from 'react/addons';
import clone from 'clone';

import Animove from '../component/animove.jsx';


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var style = {
  WebkitTransition: 'all 1s ease-out',
  transition: 'all ease-out 1s'
};


class Demo extends React.Component {

  state = { shifted: false, list: [1, 2, 3] };

  render(){
    var calcStyle = clone(style);
    calcStyle.backgroundColor = this.state.shifted? 'rgb(0,0,255)': 'rgb(255,0,0)';

    var listNodes = this.state.list.map(item => {
      return <Animove className='anim' key={item}>
        {item}
      </Animove>;
    });

    return <div onClick={this._onClick.bind(this)}>
      {this.state.shifted && <div>buyakasha</div>}

      <Animove
        style={calcStyle}
      >
        Sup
      </Animove>

      {listNodes}
    </div>;
  }

  _onClick(){
    this.setState({
      shifted: !this.state.shifted,
      list: shuffle(this.state.list)
    });
  }

  componentDidMount(){
    setTimeout(() => {
      this.forceUpdate();
    }.bind(this), 5000);
  }

}


React.render(<Demo />, document.getElementById('main'));
