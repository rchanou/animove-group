import React from 'react/addons';

export class Movable extends React.Component {

  render(){
    let { element, children, ...otherProps } = this.props;

    return React.createElement(
      this.props.element,
      otherProps,
      this.props.children
    );
  }

}
