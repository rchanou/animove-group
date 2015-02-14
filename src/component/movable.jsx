import React from 'react/addons';


class Movable extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    let { element, children, ...otherProps } = this.props;

    return React.createElement(
      element,
      otherProps,
      children
    );
  }

};

Movable.defaultProps = { element: 'div' };

export default Movable;
