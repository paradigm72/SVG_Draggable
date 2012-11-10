//Namespace
var com;
if (!com) {	com = {}; }
if (!com.SVG) {	com.SVG = {}; }

/**********************************************************
*** SVG.MovableParent
***   Object representing an SVG parent whose children can be dragged around by clicking and holding
***   the mouse button on them. This parent-child structure is used because otherwise,
***   the mouse cursor gets 'ahead' of the SVG element and dragging is choppy and interrupted.
***
***   Usage: 
***     var myParent = new SVG.MovableParent;
***     myParent.Initialize(<svgHTMLParentElement>);
***     myParent.AddChild(<svgHTMLElementToAttach>);
***     <repeat .AddChild for all children>
***
***   Public Interface:
***     Initalize(parentElement)
***     Element()
***     ChildBeginDrag(childMovable)
***     ChildEndDrag(childMovable)
***     ParentMouseMoved(e)
***     ParentEndDrag()
***     AddChild(childMovable)
**********************************************************/
com.SVG.MovableParent = function () {
    var myElement;
    var myChildren = [];
    var whichChildHasMouseDown;

    var init = function (initElement) {
        myElement = initElement;
        initElement.onmousemove = handleParentMouseMovement;
        initElement.onmouseup = endMouseDragOnParent;
    }

    var addChild = function (childMovable) {
        myChildren.push(childMovable);

    }

    var getChildIndex = function (childMovableID) {
        for (var i = 0; i < myChildren.length; i++) {
            if (myChildren[i].ID() == childMovableID) {
                return i;
            }
        }
    }

    var childBeginDragAttempt = function (childMovableID) {
        //if no child element is being dragged, find the right index and start dragging this one
        if (whichChildHasMouseDown == null) {
            whichChildHasMouseDown = getChildIndex(childMovableID);
            return true;   //for now, also tell the child that it has the right to drag
        }
        //if there's already a child element being dragged, do nothing
        else { return false; }
    }

    var handleParentMouseMovement = function (e) {
        if (whichChildHasMouseDown != null) {
            myChildren[whichChildHasMouseDown].MouseMoved(e);
        }
    }

    var endMouseDragOnParent = function () {
        if (whichChildHasMouseDown != null ) {
            myChildren[whichChildHasMouseDown].EndDrag;
            whichChildHasMouseDown == null;
        }
    }

    var childEndDrag = function (childMovableID) {
        //sanity check that this event is coming from the element that actually was dragging
        if (whichChildHasMouseDown == getChildIndex(childMovableID)) {
            whichChildHasMouseDown = null;
            return true;
        }
        else { return false; }
    }


    //could implement some handling to arbitrate between child elements here, if needed

    return {
        Initalize: function (thisParentElement) { init(thisParentElement); },
        Element: function () { return myElement; },
        ChildBeginDrag: function (childMovable) { return childBeginDragAttempt(childMovable); },
        ChildEndDrag: function (childMovable) { return childEndDrag(childMovable); },
        ParentMouseMoved: function (e) { handleParentMouseMovement(e); },
        ParentEndDrag: function () { endMouseDragOnParent(); },
        AddChild: function (childMovable) { addChild(childMovable); }
    }

}