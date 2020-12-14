"use strict";
import * as React from "react";
import * as ReactDOM from "react-dom";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionId = powerbi.visuals.ISelectionId;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import FilterDropDown from "./filterdropdown";
import { VisualSettings } from "./settings";

import "./../style/visual.less";

export class Visual implements IVisual {

    private target: HTMLElement;
    private settings: VisualSettings;
    private selectionManager: ISelectionManager;
    private host: IVisualHost;
    private reactRoot: React.ComponentElement<any, any>;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.selectionManager = options.host.createSelectionManager();
        this.reactRoot = React.createElement(FilterDropDown, {host: this.host, selectionManager: this.selectionManager});
        this.target = options.element;

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {
        const dataView: DataView = options.dataViews[0];
        var value:any = [];
        const categories = dataView.categorical.categories;
        const categoriesCount = categories[0].values.length;
        for (let categoryIndex = 0; categoryIndex < categoriesCount; categoryIndex++) {
            const categoryValue: powerbi.PrimitiveValue = categories[0].values[categoryIndex];
            const categorySelectionId = this.host.createSelectionIdBuilder()
                .withCategory(categories[0], categoryIndex) // we have only one category (only one `Manufacturer` column)
                .createSelectionId();
            value.push({value: categorySelectionId, label: categoryValue, selectionId: categorySelectionId});
           
            console.log(categorySelectionId);
        }

        FilterDropDown.update({
            options: value,
            multiValue: []
        });
    }
}