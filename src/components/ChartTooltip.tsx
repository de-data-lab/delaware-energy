import {
  arrow,
  autoPlacement,
  FloatingArrow,
  FloatingPortal,
  offset,
  Placement, ReferenceType, useFloating, useFocus, useHover, useInteractions, useRole, useTransitionStyles
} from "@floating-ui/react";

import React, { useRef, useState } from "react";
import './ChartTooltip.css';

interface DataObject {
    [key:string]: string | number | boolean
}

  export const useTooltip = (): any => {
    const [tooltipData, setTooltipData] = useState<string | number | DataObject>("");
    const [tooltipRef, setTooltipRef] = useState<EventTarget | null>(null);
  
    /**
     * Shows the tooltip and passes it a string, number or data object to use as the tooltip content. Cleanup not necessary as the tooltip hides itself when it loses focus.  
     * @param e The event that triggers the tooltip being shown. 
     * @param d The string, number, or data object to use as the tooltip content. 
     */

    const showTooltip = (e: React.MouseEvent, data: string|number|DataObject): void => {
      setTooltipRef(e.currentTarget);
      setTooltipData(data);
    };
  
  
    return {
      setTooltipData,
      tooltipData,
      showTooltip,
      tooltipRef,
      setTooltipRef,
    };
  };
  
export interface TooltipConfig {
    /** **Required**, the data object used to build the tooltip */
    data: DataObject,
    /** The placement of the tooltip, one of `"top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"`. Has no effect if `autoPlace` is set to `true` */
    placement: Placement;
    /** **Required**, the element to use as the anchor for the tooltip. */
    anchor: ReferenceType;
    /** Should there be an arrow pointing from the tooltip to the anchor point? */
    showArrow?: boolean; 
    /** Custom className, defaults to "sire-tooltip" if none provided */
    tooltipClass?: string;
    /** Makes chart color scale available in tooltip */
    colorScale: any;
    /** Tooltip title */
    title?: string; 
    /** The x-axis column name */
    xAxis: string;
    /** The y-axis column name */
    yAxis: string; 
    /** Automatically position the tooltip? */
    autoPlace?: boolean;
    /** function that returns custom tooltip content  */
    customContent?: (d: DataObject) => string | number;
    /** function that returns custom tooltip title  */
    customTitle?: (d: DataObject) => string; 
    /** Formatter used to format x axis tooltip value */
    xAxisFormatter?: (d: DataObject | string | number | boolean) => string | number;
    /** Formatter used to format y axis tooltip value */
    yAxisFormatter?: (d: DataObject | string | number | boolean) => string | number;
    /** Additional custom styles for the tooltip */
    styles?: React.CSSProperties
  }
  
  // Partial of TooltipConfig for user-defined options, omits anchor and content since these have to be present to work
  export type UserTooltipConfig = Partial<Omit<TooltipConfig,"anchor"|"data">>;

  const ChartTooltip = ({ 
        anchor, 
        autoPlace=true,
        placement="top", 
        showArrow=true, 
        data, 
        xAxis,
        yAxis,
        title,
        styles,
        colorScale,
        tooltipClass = "sire-tooltip",
        xAxisFormatter,
        yAxisFormatter, 
        customContent,
        customTitle
      }: TooltipConfig) => {

    const arrowRef = useRef(null);

    const [tooltipVisible, setTooltipVisible] = useState<boolean>();

    const { refs, floatingStyles, context } = useFloating({
      placement: placement,
      open: tooltipVisible,
      onOpenChange: setTooltipVisible,
      middleware: [
        autoPlace ? autoPlacement() : false,
        arrow({element: arrowRef}),
        offset(5),
      ],
      elements: {
        reference: anchor,
      },
    });

    const hover = useHover(context);
    const role = useRole(context);
    const focus = useFocus(context);
    const {isMounted, styles: transitionStyles} = useTransitionStyles(context);
    const { getFloatingProps } = useInteractions([role, focus, hover]);

    const defaultStyles: React.CSSProperties = {
        maxWidth: "250px",
        padding: ".5rem 1rem",
        backgroundColor: "rgba(255,255,255,0.9)",
        zIndex: 900,
        boxShadow: "1px 1px 10px rgba(0,0,0,0.2)",
        borderRadius: "10px",
        color: "#696969",
        fontFamily: "var(--main-font)"
        }

    return (
      <>
        {
          tooltipVisible &&
          <FloatingPortal>
            <div
              className={tooltipClass}
              ref={refs.setFloating}
              {...getFloatingProps()}
              style={{
                ...transitionStyles,
                ...floatingStyles,
                ...defaultStyles,
                ...styles
              }}
            >
              {
                customContent &&
                <>
                <div className="tooltip-title">
                      <div style={{backgroundColor: colorScale(data[title!]), height: "10px", width: "10px", borderRadius: "2px"}}></div>
                      <h3>{!customTitle ? data[title!] : customTitle(data)}</h3>
                   </div>
               <div dangerouslySetInnerHTML={{__html: customContent(data)}}/>  {/* Refactor not to use dangerouslySetInnerHTML... */}
               </>
              }
              { !customContent && 
              <>
                { 
                  title && 
                    <div className="tooltip-title">
                      <div style={{backgroundColor: colorScale(data[title]), height: "10px", width: "10px", borderRadius: "2px"}}></div>
                      <h3>{!customTitle ? data[title] : customTitle(data)}</h3>
                    </div>
                }
                <div className="tooltip-rows">
                <div className="tooltip-row">
                  <span className="tooltip-row-title">{yAxis}:</span> {yAxisFormatter ? yAxisFormatter(data[yAxis]) : data[yAxis]}
                </div>
                <div className="tooltip-row">
                  <span className="tooltip-row-title">{xAxis}:</span> {xAxisFormatter ? xAxisFormatter(data[xAxis]) : data[xAxis]}
                </div>
                </div>
              </>
              }
              { showArrow &&  <FloatingArrow fill={!styles?.backgroundColor ? defaultStyles.backgroundColor : styles.backgroundColor} ref={arrowRef} context={context} /> }
            </div>
             </FloatingPortal>
        }
      </>
    );
  };
  
  export default ChartTooltip;
  