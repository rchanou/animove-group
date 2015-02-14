import React from 'react/addons';


export default class Movable extends React.Component {

  static defaultProps = { element: 'div' };

  render(){
    let { element, children, ...otherProps } = this.props;

    return React.createElement(
      element,
      otherProps,
      children
    );
  }

};
