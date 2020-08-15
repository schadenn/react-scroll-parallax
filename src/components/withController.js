import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParallaxContext from '../helpers/ParallaxContext';
import { v4 } from 'uuid';

export default (WrappedComponent) => {
    class WithController extends Component {
        state = {
            id: v4(),
        };

        static propTypes = {
            parallaxController: PropTypes.object,
        };

        render() {
            return (
                <ParallaxContext.Consumer>
                    {({ controller, elements }) => {
                        const elmRef = elements.find(
                            (elm) => elm.id === this.state.id
                        );
                        return (
                            <WrappedComponent
                                id={this.state.id}
                                parallaxStyles={
                                    elmRef
                                        ? elmRef.parallaxStyles
                                        : 'translate3d(0, 0, 0)'
                                }
                                parallaxController={controller}
                                elements={elements}
                                {...this.props}
                            />
                        );
                    }}
                </ParallaxContext.Consumer>
            );
        }
    }

    return WithController;
};
