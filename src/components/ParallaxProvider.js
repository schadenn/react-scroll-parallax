import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ParallaxContext from '../helpers/ParallaxContext';
import ParallaxController from '../classes/ParallaxController';
import { VERTICAL, HORIZONTAL } from '../constants';
import validHTMLElement from '../utils/validHTMLElement';

const createController = (options) => {
    // Don't initialize on the server
    const isServer = typeof window === 'undefined';

    if (!isServer) {
        // Must not be the server so kick it off...
        return ParallaxController.init(options);
    }
    return null;
};

export default class ParallaxProvider extends Component {
    static defaultProps = {
        scrollAxis: VERTICAL,
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        scrollAxis: PropTypes.oneOf([VERTICAL, HORIZONTAL]),
        scrollContainer: validHTMLElement,
    };

    constructor(props) {
        super(props);

        this.controller = createController({
            scrollAxis: props.scrollAxis,
            scrollContainer: props.scrollContainer,
            onUpdate: (elements) => this.setState({ elements }),
        });

        this.state = {
            elements: [],
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.scrollContainer !== this.props.scrollContainer) {
            this.controller.updateScrollContainer(this.props.scrollContainer);
        }
    }

    componentWillUnmount() {
        this.controller = this.controller.destroy();
    }

    render() {
        const { children } = this.props;

        return (
            <ParallaxContext.Provider
                value={{
                    controller: this.controller,
                    elements: this.state.elements,
                }}
            >
                {children}
            </ParallaxContext.Provider>
        );
    }
}
