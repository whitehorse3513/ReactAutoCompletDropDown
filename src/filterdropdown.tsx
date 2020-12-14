import * as React from "react";
import * as ReactDOM from "react-dom";
import { Picky } from 'react-picky';
import 'react-picky/dist/picky.css'; // Include CSS
import powerbi from "powerbi-visuals-api";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionId = powerbi.visuals.ISelectionId;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

type MyProps = {};
type MyState = { options: any, multiValue: any  };


class FilterDropDown extends React.Component<MyProps, MyState> {
    searchInput = undefined;
    private selectionManager: ISelectionManager;
    private host: IVisualHost;

    constructor(props) {
        super(props)
        this.selectionManager = props.selectionManager;
        this.host = props.host;
        this.state = {
            options: [],
            multiValue: []
        }
    }

    private static updateCallback: (data: object) => void = null;

    public static update(newState: MyState) {
        if (typeof FilterDropDown.updateCallback === 'function') {
            FilterDropDown.updateCallback(newState);
        }
    }

    public componentWillMount() {
        FilterDropDown.updateCallback = (newState: MyState): void => { this.setState(newState); };
    }

    public componentWillUnmount() {
        FilterDropDown.updateCallback = null;
    }

    render() {
        let { options, multiValue } = this.state;
        console.log(multiValue);
        this.selectionManager.clear();
        (multiValue as Array<any>).forEach(element => {
            this.selectionManager.select(element.selectionId, true);
        });        
        return (
            <div className="App">
                <Picky
                    id="picky"
                    labelKey="label"
                    valueKey="value"
                    options={options}
                    value={multiValue}
                    multiple={true}
                    includeSelectAll={true}
                    includeFilter={true}
                    onChange={values => {
                        this.setState({multiValue: values});
                    }}
                    dropdownHeight={600}
                />
            </div>
        );
    }
}


export default FilterDropDown;