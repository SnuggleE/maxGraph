/**
README
******
- Edge-to-edge connections: We store the point where the mouse
was released in the terminal points of the edge geometry and
use that point to find the nearest segment on the target edge
and the connection point between the two edges in
mxGraphView.updateFixedTerminalPoint.

- The orthogonal router, which is implemented as an edge style,
computes its result based on the output of mxGraphView.
updateFixedTerminalPoint, which computes all connection points
for edge-to-edge connections and constrained ports and vertices
and stores them in state.absolutePoints. 

- Routing directions are stored in the 'portConstraint' style.
Possible values for this style horizontal and vertical. Note
that this may have other values depending on the edge style.

- For edge-to-edge connections, a 'source-/targetConstraint'
style is added in updateFixedTerminalPoint that contains the
orientation of the segment that the edge connects to. Possible
values are horizontal, vertical.

- An alternative solution for connection points via connection
constraints is demonstrated. In this setup, the edge is connected
to the parent cell directly. There are no child cells that act
as "ports". Instead, the connection information is stored as a
relative point in the connecting edge. (See also: portrefs.html
for storing references to ports.)

 */

import React from 'react';
import mxEvent from '../mxgraph/util/mxEvent';
import mxGraph from '../mxgraph/view/mxGraph';
import mxRubberband from '../mxgraph/handler/mxRubberband';

class MYNAMEHERE extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // A container for the graph
    return (
      <>
        <h1>Wires</h1>

        <div
          ref={el => {
            this.el = el;
          }}
          style={{

          }}
        />
      </>
    );
  };

  componentDidMount() {

  };
}

export default MYNAMEHERE;


<head>
  <title></title>
  <!-- Sets the basepath for the library if not in same directory -->
  <script type="text/javascript">
    mxBasePath = '../src';
  </script>

  <!-- Loads and initializes the library -->
  <script type="text/javascript" src="../src/js/Client.js"></script>
  <script type="text/javascript">
    // If connect preview is not moved away then getCellAt is used to detect the cell under
    // the mouse if the mouse is over the preview shape in IE (no event transparency), ie.
    // the built-in hit-detection of the HTML document will not be used in this case.
    mxConnectionHandler.prototype.movePreviewAway = false;
    mxConnectionHandler.prototype.waypointsEnabled = true;
    mxGraph.prototype.resetEdgesOnConnect = false;
    mxConstants.SHADOWCOLOR = '#C0C0C0';
    let joinNodeSize = 7;
    let strokeWidth = 2;

    // Replaces the port image
    mxConstraintHandler.prototype.pointImage = new mxImage('images/dot.gif', 10, 10);

    // Enables guides
    mxGraphHandler.prototype.guidesEnabled = true;

      // Alt disables guides
      mxGuide.prototype.isEnabledForEvent = function(evt)
      {
        return !mxEvent.isAltDown(evt);
      };

    // Enables snapping waypoints to terminals
    mxEdgeHandler.prototype.snapToTerminals = true;

    function main(container)
    {
      let graph = new mxGraph(container);
      graph.view.scale = 1;
      graph.setPanning(true);
      graph.setConnectable(true);
      graph.setConnectableEdges(true);
      graph.setDisconnectOnMove(false);
      graph.foldingEnabled = false;

      //Maximum size
      graph.maximumGraphBounds = new mxRectangle(0, 0, 800, 600)
      graph.border = 50;

      // Panning handler consumed right click so this must be
      // disabled if right click should stop connection handler.
      graph.panningHandler.isPopupTrigger = function() { return false; };

      // Enables return key to stop editing (use shift-enter for newlines)
      graph.setEnterStopsCellEditing(true);

      // Adds rubberband selection
      new mxRubberband(graph);

      // Alternative solution for implementing connection points without child cells.
      // This can be extended as shown in portrefs.html example to allow for per-port
      // incoming/outgoing direction.
      graph.getAllConnectionConstraints = function(terminal)
      {
         let geo = (terminal != null) ? terminal.cell.getGeometry() : null;

         if ((geo != null ? !geo.relative : false) &&
           terminal.cell.isVertex() &&
           this.getModel().getChildCount(terminal.cell) == 0)
         {
          return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
              new mxConnectionConstraint(new mxPoint(1, 0.5), false)];
          }

        return null;
      };

      // Makes sure non-relative cells can only be connected via constraints
      graph.connectionHandler.isConnectableCell = function(cell)
      {
        if (this.graph.getModel().isEdge(cell))
        {
          return true;
        }
        else
        {
          let geo = (cell != null) ? cell.getGeometry() : null;

          return (geo != null) ? geo.relative : false;
        }
      };
      mxEdgeHandler.prototype.isConnectableCell = function(cell)
      {
        return graph.connectionHandler.isConnectableCell(cell);
      };

      // Adds a special tooltip for edges
      graph.setTooltips(true);

      let getTooltipForCell = graph.getTooltipForCell;
      graph.getTooltipForCell = function(cell)
      {
        let tip = '';

        if (cell != null)
        {
          let src = this.getModel().getTerminal(cell, true);

          if (src != null)
          {
            tip += this.getTooltipForCell(src) + ' ';
          }

          let parent = this.getModel().getParent(cell);

          if (parent.isVertex())
          {
            tip += this.getTooltipForCell(parent) + '.';
          }

          tip += getTooltipForCell.apply(this, arguments);

          let trg = this.getModel().getTerminal(cell, false);

          if (trg != null)
          {
            tip += ' ' + this.getTooltipForCell(trg);
          }
        }

        return tip;
      };

      // Switch for black background and bright styles
      let invert = false;

      if (invert)
      {
        container.style.backgroundColor = 'black';

        // White in-place editor text color
        mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
        mxCellEditor.prototype.startEditing = (cell, trigger) =>
        {
          mxCellEditorStartEditing.apply(this, arguments);

          if (this.textarea != null)
          {
            this.textarea.style.color = '#FFFFFF';
          }
        };

        mxGraphHandler.prototype.previewColor = 'white';
      }

      let labelBackground = (invert) ? '#000000' : '#FFFFFF';
      let fontColor = (invert) ? '#FFFFFF' : '#000000';
      let strokeColor = (invert) ? '#C0C0C0' : '#000000';
      let fillColor = (invert) ? 'none' : '#FFFFFF';

      let style = graph.getStylesheet().getDefaultEdgeStyle();
      delete style.endArrow;
      style.strokeColor = strokeColor;
      style.labelBackgroundColor = labelBackground;
      style.edgeStyle = 'wireEdgeStyle';
      style.fontColor = fontColor;
      style.fontSize = '9';
      style.movable = '0';
      style.strokeWidth = strokeWidth;
      //style.rounded = '1';

      // Sets join node size
      style.startSize = joinNodeSize;
      style.endSize = joinNodeSize;

      style = graph.getStylesheet().getDefaultVertexStyle();
      style.gradientDirection = 'south';
      //style.gradientColor = '#909090';
      style.strokeColor = strokeColor;
      //style.fillColor = '#e0e0e0';
      style.fillColor = 'none';
      style.fontColor = fontColor;
      style.fontStyle = '1';
      style.fontSize = '12';
      style.resizable = '0';
      style.rounded = '1';
      style.strokeWidth = strokeWidth;

      let parent = graph.getDefaultParent();

      graph.getModel().beginUpdate();
      try
      {
        var v1 = graph.insertVertex(parent, null, 'J1', 80, 40, 40, 80,
            'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor);
        v1.setConnectable(false);

        var v11 = graph.insertVertex(v1, null, '1', 0, 0, 10, 16,
            'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;'+
            'spacingLeft=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor);
        v11.geometry.relative = true;
        v11.geometry.offset = new mxPoint(-v11.geometry.width, 2);
        var v12 = v11.clone();
        v12.value = '2';
        v12.geometry.offset = new mxPoint(-v11.geometry.width, 22);
        v1.insert(v12);
        var v13 = v11.clone();
        v13.value = '3';
        v13.geometry.offset = new mxPoint(-v11.geometry.width, 42);
        v1.insert(v13);
        var v14 = v11.clone();
        v14.value = '4';
        v14.geometry.offset = new mxPoint(-v11.geometry.width, 62);
        v1.insert(v14);

        var v15 = v11.clone();
        v15.value = '5';
        v15.geometry.x = 1;
        v15.style =  'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;'+
          'spacingRight=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
        v15.geometry.offset = new mxPoint(0, 2);
        v1.insert(v15);
        var v16 = v15.clone();
        v16.value = '6';
        v16.geometry.offset = new mxPoint(0, 22);
        v1.insert(v16);
        var v17 = v15.clone();
        v17.value = '7';
        v17.geometry.offset = new mxPoint(0, 42);
        v1.insert(v17);
        var v18 = v15.clone();
        v18.value = '8';
        v18.geometry.offset = new mxPoint(0, 62);
        v1.insert(v18);

        var v19 = v15.clone();
        v19.value = 'clk';
        v19.geometry.x = 0.5;
        v19.geometry.y = 1;
        v19.geometry.width = 10;
        v19.geometry.height = 4;
        // NOTE: portConstraint is defined for east direction, so must be inverted here
        v19.style = 'shape=triangle;direction=north;spacingBottom=12;align=center;portConstraint=horizontal;'+
          'fontSize=8;strokeColor=' + strokeColor + ';routingCenterY=0.5;';
        v19.geometry.offset = new mxPoint(-4, -4);
        v1.insert(v19);

        var v2 = graph.insertVertex(parent, null, 'R1', 220, 220, 80, 20,
          'shape=resistor;verticalLabelPosition=top;verticalAlign=bottom;');

        // Uses implementation of connection points via constraints (see above)
        //v2.setConnectable(false);

         /*var v21 = graph.insertVertex(v2, null, 'A', 0, 0.5, 10, 1,
           'shape=none;spacingBottom=11;spacingLeft=1;align=left;fontSize=8;'+
           'fontColor=#4c4c4c;strokeColor=#909090;');
         v21.geometry.relative = true;
         v21.geometry.offset = new mxPoint(0, -1);

         var v22 = graph.insertVertex(v2, null, 'B', 1, 0.5, 10, 1,
           'spacingBottom=11;spacingLeft=1;align=left;fontSize=8;'+
           'fontColor=#4c4c4c;strokeColor=#909090;');
         v22.geometry.relative = true;
         v22.geometry.offset = new mxPoint(-10, -1);*/

        var v3 = graph.addCell(graph.getModel().cloneCell(v1));
        v3.value = 'J3';
        v3.geometry.x = 420;
        v3.geometry.y = 340;

        // Connection constraints implemented in edges, alternatively this
        // can be implemented using references, see: portrefs.html
        var e1 = graph.insertEdge(parent, null, 'e1', v1.getChildAt(7), v2,
          'entryX=0;entryY=0.5;entryPerimeter=0;');
        e1.geometry.points = [new mxPoint(180, 110)];

        var e2 = graph.insertEdge(parent, null, 'e2', v1.getChildAt(4), v2,
          'entryX=1;entryY=0.5;entryPerimeter=0;');
        e2.geometry.points = [new mxPoint(320, 50), new mxPoint(320, 230)];

        var e3 = graph.insertEdge(parent, null, 'crossover', e1, e2);
        e3.geometry.setTerminalPoint(new mxPoint(180, 140), true);
        e3.geometry.setTerminalPoint(new mxPoint(320, 140), false);

//         var e1 = graph.insertEdge(parent, null, 'e1', v1.getChildAt(7), v2.getChildAt(0));
//         e1.geometry.points = [new mxPoint(180, 140)];

//         var e2 = graph.insertEdge(parent, null, '', v1.getChildAt(4), v2.getChildAt(1));
//         e2.geometry.points = [new mxPoint(320, 80)];

//         var e3 = graph.insertEdge(parent, null, 'crossover', e1, e2);
//         e3.geometry.setTerminalPoint(new mxPoint(180, 160), true);
//         e3.geometry.setTerminalPoint(new mxPoint(320, 160), false);

        var e4 = graph.insertEdge(parent, null, 'e4', v2, v3.getChildAt(0),
          'exitX=1;exitY=0.5;entryPerimeter=0;');
        e4.geometry.points = [new mxPoint(380, 230)];

        var e5 = graph.insertEdge(parent, null, 'e5', v3.getChildAt(5), v1.getChildAt(0));
        e5.geometry.points = [new mxPoint(500, 310), new mxPoint(500, 20), new mxPoint(50, 20)];

        var e6 = graph.insertEdge(parent, null, '');
        e6.geometry.setTerminalPoint(new mxPoint(100, 500), true);
        e6.geometry.setTerminalPoint(new mxPoint(600, 500), false);

        var e7 = graph.insertEdge(parent, null, 'e7', v3.getChildAt(7), e6);
        e7.geometry.setTerminalPoint(new mxPoint(500, 500), false);
        e7.geometry.points = [new mxPoint(500, 350)];
      }
      finally
      {
        graph.getModel().endUpdate();
      }

      document.body.appendChild(mxUtils.button('Zoom In', function()
      {
        graph.zoomIn();
      }));

      document.body.appendChild(mxUtils.button('Zoom Out', function()
      {
        graph.zoomOut();
      }));

      // Undo/redo
      let undoManager = new UndoManager();
      let listener = function(sender, evt)
      {
        undoManager.undoableEditHappened(evt.getProperty('edit'));
      };
      graph.getModel().addListener(mxEvent.UNDO, listener);
      graph.getView().addListener(mxEvent.UNDO, listener);

      document.body.appendChild(mxUtils.button('Undo', function()
      {
        undoManager.undo();
      }));

      document.body.appendChild(mxUtils.button('Redo', function()
      {
        undoManager.redo();
      }));

      // Shows XML for debugging the actual model
      document.body.appendChild(mxUtils.button('Delete', function()
      {
        graph.removeCells();
      }));

      // Wire-mode
      let checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');

      document.body.appendChild(checkbox);
      mxUtils.write(document.body, 'Wire Mode');

      // Starts connections on the background in wire-mode
      let connectionHandlerIsStartEvent = graph.connectionHandler.isStartEvent;
      graph.connectionHandler.isStartEvent = function(me)
      {
        return checkbox.checked || connectionHandlerIsStartEvent.apply(this, arguments);
      };

      // Avoids any connections for gestures within tolerance except when in wire-mode
      // or when over a port
      let connectionHandlerMouseUp = graph.connectionHandler.mouseUp;
      graph.connectionHandler.mouseUp = function(sender, me)
      {
        if (this.first != null && this.previous != null)
        {
          let point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
          let dx = Math.abs(point.x - this.first.x);
          let dy = Math.abs(point.y - this.first.y);

          if (dx < this.graph.tolerance && dy < this.graph.tolerance)
          {
            // Selects edges in non-wire mode for single clicks, but starts
            // connecting for non-edges regardless of wire-mode
            if (!checkbox.checked && this.graph.getModel().isEdge(this.previous.cell))
            {
              this.reset();
            }

            return;
          }
        }

        connectionHandlerMouseUp.apply(this, arguments);
      };

      // Grid
      var checkbox2 = document.createElement('input');
      checkbox2.setAttribute('type', 'checkbox');
      checkbox2.setAttribute('checked', 'true');

      document.body.appendChild(checkbox2);
      mxUtils.write(document.body, 'Grid');

      mxEvent.addListener(checkbox2, 'click', function(evt)
      {
        if (checkbox2.checked)
        {
          container.style.background = 'url(\'images/wires-grid.gif\')';
        }
        else
        {
          container.style.background = '';
        }

        container.style.backgroundColor = (invert) ? 'black' : 'white';
      });

      mxEvent.disableContextMenu(container);
    };
  </script>
<!--  
    Updates connection points before the routing is called.
-->
  <script type="text/javascript">
    // Computes the position of edge to edge connection points.
    mxGraphView.prototype.updateFixedTerminalPoint = function(edge, terminal, source, constraint)
    {
      let pt = null;

      if (constraint != null)
      {
        pt = this.graph.getConnectionPoint(terminal, constraint);
      }

      if (source)
      {
        edge.sourceSegment = null;
      }
      else
      {
        edge.targetSegment = null;
      }

      if (pt == null)
      {
        let s = this.scale;
        let tr = this.translate;
        let orig = edge.origin;
        let geo = edge.cell.getGeometry();
        pt = geo.getTerminalPoint(source);

        // Computes edge-to-edge connection point
        if (pt != null)
        {
          pt = new mxPoint(s * (tr.x + pt.x + orig.x),
                   s * (tr.y + pt.y + orig.y));

          // Finds nearest segment on edge and computes intersection
          if (terminal != null && terminal.absolutePoints != null)
          {
            let seg = mxUtils.findNearestSegment(terminal, pt.x, pt.y);

            // Finds orientation of the segment
            var p0 = terminal.absolutePoints[seg];
            let pe = terminal.absolutePoints[seg + 1];
            let horizontal = (p0.x - pe.x == 0);

            // Stores the segment in the edge state
            let key = (source) ? 'sourceConstraint' : 'targetConstraint';
            let value = (horizontal) ? 'horizontal' : 'vertical';
            edge.style[key] = value;

            // Keeps the coordinate within the segment bounds
            if (horizontal)
            {
              pt.x = p0.x;
              pt.y = Math.min(pt.y, Math.max(p0.y, pe.y));
              pt.y = Math.max(pt.y, Math.min(p0.y, pe.y));
            }
            else
            {
              pt.y = p0.y;
              pt.x = Math.min(pt.x, Math.max(p0.x, pe.x));
              pt.x = Math.max(pt.x, Math.min(p0.x, pe.x));
            }
          }
        }
        // Computes constraint connection points on vertices and ports
        else if (terminal != null && terminal.cell.geometry.relative)
        {
          pt = new mxPoint(this.getRoutingCenterX(terminal),
            this.getRoutingCenterY(terminal));
        }

        // Snaps point to grid
        /*if (pt != null)
        {
          let tr = this.graph.view.translate;
          let s = this.graph.view.scale;

          pt.x = (this.graph.snap(pt.x / s - tr.x) + tr.x) * s;
          pt.y = (this.graph.snap(pt.y / s - tr.y) + tr.y) * s;
        }*/
      }

      edge.setAbsoluteTerminalPoint(pt, source);
    };
  </script>
<!--  
  Overrides methods to preview and create new edges.
-->
  <script type="text/javascript">
    // Sets source terminal point for edge-to-edge connections.
    mxConnectionHandler.prototype.createEdgeState = function(me)
    {
      let edge = this.graph.createEdge();

      if (this.sourceConstraint != null && this.previous != null)
      {
        edge.style = 'exitX'+'='+this.sourceConstraint.point.x+';'+
          'exitY'+'='+this.sourceConstraint.point.y+';';
      }
      else if (this.graph.model.isEdge(me.getCell()))
      {
        let scale = this.graph.view.scale;
        let tr = this.graph.view.translate;
        let pt = new mxPoint(this.graph.snap(me.getGraphX() / scale) - tr.x,
            this.graph.snap(me.getGraphY() / scale) - tr.y);
        edge.geometry.setTerminalPoint(pt, true);
      }

      return this.graph.view.createState(edge);
    };

    // Uses right mouse button to create edges on background (see also: lines 67 ff)
    mxConnectionHandler.prototype.isStopEvent = function(me)
    {
      return me.getState() != null || mxEvent.isRightMouseButton(me.getEvent());
    };

    // Updates target terminal point for edge-to-edge connections.
    mxConnectionHandlerUpdateCurrentState = mxConnectionHandler.prototype.updateCurrentState;
    mxConnectionHandler.prototype.updateCurrentState = function(me)
    {
      mxConnectionHandlerUpdateCurrentState.apply(this, arguments);

      if (this.edgeState != null)
      {
        this.edgeState.cell.geometry.setTerminalPoint(null, false);

        if (this.shape != null && this.currentState != null &&
          this.currentState.view.graph.model.isEdge(this.currentState.cell))
        {
          let scale = this.graph.view.scale;
          let tr = this.graph.view.translate;
          let pt = new mxPoint(this.graph.snap(me.getGraphX() / scale) - tr.x,
              this.graph.snap(me.getGraphY() / scale) - tr.y);
          this.edgeState.cell.geometry.setTerminalPoint(pt, false);
        }
      }
    };

    // Updates the terminal and control points in the cloned preview.
    mxEdgeSegmentHandler.prototype.clonePreviewState = function(point, terminal)
    {
      let clone = mxEdgeHandler.prototype.clonePreviewState.apply(this, arguments);
      clone.cell = clone.cell.clone();

      if (this.isSource || this.isTarget)
      {
        clone.cell.geometry = clone.cell.geometry.clone();

        // Sets the terminal point of an edge if we're moving one of the endpoints
        if (this.graph.getModel().isEdge(clone.cell))
        {
          // TODO: Only set this if the target or source terminal is an edge
          clone.cell.geometry.setTerminalPoint(point, this.isSource);
        }
        else
        {
          clone.cell.geometry.setTerminalPoint(null, this.isSource);
        }
      }

      return clone;
    };

    let mxEdgeHandlerConnect = mxEdgeHandler.prototype.connect;
    mxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me)
    {
      let result = null;
      let model = this.graph.getModel();
      let parent = model.getParent(edge);

      model.beginUpdate();
      try
      {
        result = mxEdgeHandlerConnect.apply(this, arguments);
        let geo = model.getGeometry(result);

        if (geo != null)
        {
          geo = geo.clone();
          let pt = null;

          if (model.isEdge(terminal))
          {
            pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
            pt.x = pt.x / this.graph.view.scale - this.graph.view.translate.x;
            pt.y = pt.y / this.graph.view.scale - this.graph.view.translate.y;

            let pstate = this.graph.getView().getState(
                this.graph.getModel().getParent(edge));

            if (pstate != null)
            {
              pt.x -= pstate.origin.x;
              pt.y -= pstate.origin.y;
            }

            pt.x -= this.graph.panDx / this.graph.view.scale;
            pt.y -= this.graph.panDy / this.graph.view.scale;
          }

          geo.setTerminalPoint(pt, isSource);
          model.setGeometry(edge, geo);
        }
      }
      finally
      {
        model.endUpdate();
      }

      return result;
    };
  </script>
<!--  
  Adds in-place highlighting for complete cell area (no hotspot).
-->
  <script type="text/javascript">
    mxConnectionHandlerCreateMarker = mxConnectionHandler.prototype.createMarker;
    mxConnectionHandler.prototype.createMarker = function()
    {
      let marker = mxConnectionHandlerCreateMarker.apply(this, arguments);

      // Uses complete area of cell for new connections (no hotspot)
      marker.intersects = function(state, evt)
      {
        return true;
      };

      // Adds in-place highlighting
      mxCellHighlightHighlight = mxCellHighlight.prototype.highlight;
      marker.highlight.highlight = function(state)
      {
        if (this.state != state)
        {
          if (this.state != null)
          {
            this.state.style = this.lastStyle;

            // Workaround for shape using current stroke width if no strokewidth defined
            this.state.style.strokeWidth = this.state.style.strokeWidth || '1';
            this.state.style.strokeColor = this.state.style.strokeColor || 'none';

            if (this.state.shape != null)
            {
              this.state.view.graph.cellRenderer.configureShape(this.state);
              this.state.shape.redraw();
            }
          }

          if (state != null)
          {
            this.lastStyle = state.style;
            state.style = mxUtils.clone(state.style);
            state.style.strokeColor = '#00ff00';
            state.style.strokeWidth = '3';

            if (state.shape != null)
            {
              state.view.graph.cellRenderer.configureShape(state);
              state.shape.redraw();
            }
          }

          this.state = state;
        }
      };

      return marker;
    };

    mxEdgeHandlerCreateMarker = mxEdgeHandler.prototype.createMarker;
    mxEdgeHandler.prototype.createMarker = function()
    {
      let marker = mxEdgeHandlerCreateMarker.apply(this, arguments);

      // Adds in-place highlighting when reconnecting existing edges
      marker.highlight.highlight = this.graph.connectionHandler.marker.highlight.highlight;

      return marker;
    }
  </script>
<!--  
  Adds oval markers for edge-to-edge connections.
-->
  <script type="text/javascript">
    mxGraphGetCellStyle = mxGraph.prototype.getCellStyle;
    mxGraph.prototype.getCellStyle = function(cell)
    {
      let style = mxGraphGetCellStyle.apply(this, arguments);

      if (style != null && this.model.isEdge(cell))
      {
        style = mxUtils.clone(style);

        if (this.model.isEdge(this.model.getTerminal(cell, true)))
        {
          style.startArrow = 'oval';
        }

        if (this.model.isEdge(this.model.getTerminal(cell, false)))
        {
          style.endArrow = 'oval';
        }
      }

      return style;
    };
  </script>
<!--  
  Imlements a custom resistor shape. Direction currently ignored here.
-->
  <script type="text/javascript">
    function ResistorShape() { };
    ResistorShape.prototype = new mxCylinder();
    ResistorShape.prototype.constructor = ResistorShape;

    ResistorShape.prototype.redrawPath = function(path, x, y, w, h, isForeground)
    {
      let dx = w / 16;

      if (isForeground)
      {
        path.moveTo(0, h / 2);
        path.lineTo(2 * dx, h / 2);
        path.lineTo(3 * dx, 0);
        path.lineTo(5 * dx, h);
        path.lineTo(7 * dx, 0);
        path.lineTo(9 * dx, h);
        path.lineTo(11 * dx, 0);
        path.lineTo(13 * dx, h);
        path.lineTo(14 * dx, h / 2);
        path.lineTo(16 * dx, h / 2);

        path.end();
      }
    };

    mxCellRenderer.registerShape('resistor', ResistorShape);
  </script>
<!--  
  Imlements a custom resistor shape. Direction currently ignored here.
-->
  <script type="text/javascript">
  mxEdgeStyle.WireConnector = function(state, source, target, hints, result)
  {
    // Creates array of all way- and terminalpoints
    let pts = state.absolutePoints;
    let horizontal = true;
    let hint = null;

    // Gets the initial connection from the source terminal or edge
    if (source != null && state.view.graph.model.isEdge(source.cell))
    {
      horizontal = state.style.sourceConstraint == 'horizontal';
    }
    else if (source != null)
    {
      horizontal = source.style.portConstraint != 'vertical';

      // Checks the direction of the shape and rotates
      let direction = source.style.direction;

      if (direction == 'north' || direction == 'south')
      {
        horizontal = !horizontal;
      }
    }

    // Adds the first point
    // TODO: Should move along connected segment
    let pt = pts[0];

    if (pt == null && source != null)
    {
      pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
    }
    else if (pt != null)
    {
      pt = pt.clone();
    }

    let first = pt;

    // Adds the waypoints
    if (hints != null && hints.length > 0)
    {
      // FIXME: First segment not movable
      /*hint = state.view.transformControlPoint(state, hints[0]);
      MaxLog.show();
      MaxLog.debug(hints.length,'hints0.y='+hint.y, pt.y)

      if (horizontal && Math.floor(hint.y) != Math.floor(pt.y))
      {
        MaxLog.show();
        MaxLog.debug('add waypoint');

        pt = new mxPoint(pt.x, hint.y);
        result.push(pt);
        pt = pt.clone();
        //horizontal = !horizontal;
      }*/

      for (let i = 0; i < hints.length; i++)
      {
        horizontal = !horizontal;
        hint = state.view.transformControlPoint(state, hints[i]);

        if (horizontal)
        {
          if (pt.y != hint.y)
          {
            pt.y = hint.y;
            result.push(pt.clone());
          }
        }
        else if (pt.x != hint.x)
        {
          pt.x = hint.x;
          result.push(pt.clone());
        }
      }
    }
    else
    {
      hint = pt;
    }

    // Adds the last point
    pt = pts[pts.length - 1];

    // TODO: Should move along connected segment
    if (pt == null && target != null)
    {
      pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
    }

    if (horizontal)
    {
      if (pt.y != hint.y && first.x != pt.x)
      {
        result.push(new mxPoint(pt.x, hint.y));
      }
    }
    else if (pt.x != hint.x && first.y != pt.y)
    {
      result.push(new mxPoint(hint.x, pt.y));
    }
  };

  mxStyleRegistry.putValue('wireEdgeStyle', mxEdgeStyle.WireConnector);

  // This connector needs an mxEdgeSegmentHandler
  mxGraphCreateHandler = mxGraph.prototype.createHandler;
  mxGraph.prototype.createHandler = function(state)
  {
    let result = null;

    if (state != null)
    {
      if (this.model.isEdge(state.cell))
      {
        let style = this.view.getEdgeStyle(state);

        if (style == mxEdgeStyle.WireConnector)
        {
          return new mxEdgeSegmentHandler(state);
        }
      }
    }

    return mxGraphCreateHandler.apply(this, arguments);
  };
  </script>
</head>
<body onload="main(document.getElementById('graphContainer'))">
  <div id="graphContainer"
    style="overflow:auto;position:relative;width:800px;height:600px;border:1px solid gray;background:url('images/wires-grid.gif');background-position:-1px 0px;cursor:crosshair;">
  </div>
</body>
</html>
