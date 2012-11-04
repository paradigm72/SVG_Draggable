//create the namespaces if not already created
var com;
if (!com) {
	com = {};
}
if (!com.local) {
	com.local = {};
}
if (!com.local.SVG) {
	com.local.SVG = {};
}

//library of core SVG functions
//accessed from inside Movable only
com.local.SVG.Lib = function () {


    function movePathObject(pathElement, xOffset, yOffset) {
        var segments = pathElement.pathSegList;
        var composedDAttribute = "";

        for (var i = 0; i < segments.numberOfItems; i++) {
            var pathSegment = segments.getItem(i);

            switch (pathSegment.pathSegType) {
                case SVGPathSeg.PATHSEG_MOVETO_ABS:
                    {
                        pathSegment.x += xOffset;
                        pathSegment.y += yOffset;
                        composedDAttribute = composedDAttribute + "M" + pathSegment.x + " " + pathSegment.y + " ";
                        break;
                    }
                case SVGPathSeg.PATHSEG_LINETO_ABS:
                    {
                        pathSegment.x += xOffset;
                        pathSegment.y += yOffset;
                        composedDAttribute = composedDAttribute + "L" + pathSegment.x + " " + pathSegment.y + " ";
                        break;
                    }
                    break;
            }
        }
        composedDAttribute += "Z";
        pathElement.setAttribute('d', composedDAttribute);
    }

    /*e.g. pointIndex=0 is starting, pointIndex=1 is the second point, etc.
    Not used in this example - just another possible library function
    */
    function getPathPointCoords(pathElement, pointIndex) {
        var segments = pathElement.pathSegList;
        var pathSegment = segments.getItem(pointIndex);
        var startCoords = { x: pathSegment.x, y: pathSegment.y };
        return startCoords;

    }

    return {
        MovePathObject: function (pathElement, xOffset, yOffset) {
            return movePathObject(pathElement, xOffset, yOffset);
        }
    }
} ();

/*class to define a path object that can be moved - just need to attach handlers
to tell it when moving starts, continues, and ends*/
com.local.SVG.MovableChild = function () {
    var movableElement;
    var parentElement;
    var mousePrevPos = { x: null, y: null };
    var mouseDownOnElement;


    var init = function (element, parent) {
        movableElement = element;
        parentElement = parent;
        movableElement.onmousedown = beginMouseDrag;
        movableElement.onmousemove = handleMouseMovement;
        movableElement.onmouseup = endMouseDrag;
    };

    var beginMouseDrag = function (e) {
        mouseDownOnElement = true;
        mousePrevPos.x = e.pageX;
        mousePrevPos.y = e.pageY;
        if (mousePrevPos.x == null) { mousePrevPos.x = e.clientX; }
        if (mousePrevPos.y == null) { mousePrevPos.y = e.clientY; }
    };

    var handleMouseMovement = function (e) {
        if (mouseDownOnElement == true) {
            var mouseDelta = { x: e.pageX - mousePrevPos.x, y: e.pageY - mousePrevPos.y };
            com.local.SVG.Lib.MovePathObject(movableElement, mouseDelta.x, mouseDelta.y);
            mousePrevPos.x = e.pageX;
            mousePrevPos.y = e.pageY;
        }
    };

    var endMouseDrag = function () {
        mouseDownOnElement = false;
    }

    return {
        Initialize: function (element, parent) { init(element, parent); },
        BeginDrag: function (e) { beginMouseDrag(e); },
        MouseMoved: function (e) { handleMouseMovement(e); },
        EndDrag: function () { endMouseDrag(); }
    }

}


com.local.SVG.MovableParent = function () {
    var myChildren = [];
    var whichChildHasMouseDown;

    var addChild = function (childElement) {
        myChildren.push(childElement);

    }

    //find the index value of a child element, given the element object
    var getChildIndex = function (childElement) {
        for (var i = 1; i < myChildren.length; i++) {
            if (myChildren[i] == childElement) {
                return i;
            }
        }
    }

    var childBeginDragAttempt = function (childElement) {
        //if no child element is being dragged, find the right index and start dragging this one
        if (whichChildHasMouseDown == null) {
            whichChildHasMouseDown = getChildIndex(childElement);
            return true;   //for now, also tell the child that it has the right to drag
        }
        //if there's already a child element being dragged, do nothing
        else { return false;  }
    }

    var childEndDrag = function (childElement) {
        //sanity check that this event is coming from the element that actually was dragging
        if (whichChildHasMouseDown == getChildIndex(childElement)) {
            whichChildHasMouseDown = null;
        }
    }

    //could implement some handling to arbitrate between child elements here, if needed

}

//UI to test the Movable class
com.local.SVGHandlers = function () {
    var myTriangle;
    var myTriangle2;
    var myParent;

    function attachEventHandlers() {
        //define the object that can be dragged
        myTriangle = document.getElementById("myTriangle");
        //secondary element that can be dragged
        myTriangle2 = document.getElementById("myTriangle2");
        //specify the region in which dragging should work well
        myParent = document.getElementById("svgHost");

        var movableTriangle = new com.local.SVG.MovableChild;
        var movableTriangle2 = new com.local.SVG.MovableChild;
        var movableParent = new com.local.SVG.MovableParent;

        movableTriangle.Initialize(myTriangle, myParent);
        movableTriangle2.Initialize(myTriangle2, myParent);


        myParent.onmousemove = movableTriangle.MouseMoved;
        myParent.onmouseup = movableTriangle.EndDrag;

        /*TODO:
        -collision detection?
        */
    };

    return {
        Initialize: function () { attachEventHandlers(); }
    }
} ();

//finally, link all this to the HTML window
window.onload = com.local.SVGHandlers.Initialize;