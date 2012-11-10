//Namespace
var com;
if (!com) {	com = {}; }
if (!com.SVG) {	com.SVG = {}; }

/**********************************************************
*** SVG.MovableChild
***   Object representing an SVG element that can be dragged by holding down the mouse button
***   Must be used along with a parent SVG element as the "drag frame" - this is because otherwise,
***   the mouse cursor gets 'ahead' of the SVG element and dragging is choppy and interrupted.
***
***   Usage: 
***     var myObject = new SVG.MovableChild;
***     myObject.Initialize(<svgHTMLElementToAttach>,<svgHTMLParentElement>);
***     ...
***     <see SVG.MovableParent for linking code (nothing will happen if not linked)>
***
***   Public Interface:
***     Initialize(element, parent)
***     BeginDrag(e)
***     MouseMoved(e)
***     EndDrag()
***     ID()
**********************************************************/
com.SVG.MovableChild = function () {
    var movableElement;
    var myID;
    var parentElement;
    var myParentMovable;
    var mousePrevPos = { x: null, y: null };
    var mouseDownOnElement;


    var init = function (thisElement, parentMovable) {
        //set up relationship to parent
        movableElement = thisElement;
        myID = thisElement.id;
        myParentMovable = parentMovable;
        parentElement = parentMovable.Element;

        //setup mouse handlers for this child
        movableElement.onmousedown = beginMouseDrag;
        movableElement.onmousemove = handleMouseMovement;
        movableElement.onmouseup = endMouseDrag;
    };

    var beginMouseDrag = function (e) {
        //check with the parent about whether we can drag
        if (myParentMovable.ChildBeginDrag(myID)) {
            mouseDownOnElement = true;
            mousePrevPos.x = e.pageX;
            mousePrevPos.y = e.pageY;
            if (mousePrevPos.x == null) { mousePrevPos.x = e.clientX; }
            if (mousePrevPos.y == null) { mousePrevPos.y = e.clientY; }
        }
    };

    var handleMouseMovement = function (e) {
        if (mouseDownOnElement == true) {
            var mouseDelta = { x: e.pageX - mousePrevPos.x, y: e.pageY - mousePrevPos.y };
            com.SVG.Lib.MovePathObject(movableElement, mouseDelta.x, mouseDelta.y);
            mousePrevPos.x = e.pageX;
            mousePrevPos.y = e.pageY;
        }
    };

    var endMouseDrag = function () {
        if (myParentMovable.ChildEndDrag(myID)) {
            mouseDownOnElement = false;
        }
    }

    return {
        Initialize: function (element, parent) { init(element, parent); },
        BeginDrag: function (e) { beginMouseDrag(e); },
        MouseMoved: function (e) { handleMouseMovement(e); },
        EndDrag: function () { endMouseDrag(); },
        ID: function () { return myID; }
    }

}