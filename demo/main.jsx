import React from 'react/addons';

import Movable from './src/component/movable.jsx';

class Demo extends React.Component {

  render(){
    return <Movable element='div'>
      Sup
    </Movable>;
  }

}

React.render(<Demo />, document.body);
