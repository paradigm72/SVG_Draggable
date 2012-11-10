//Namespace
var com;
if (!com) {	com = {}; }
if (!com.SVG) {	com.SVG = {}; }

/**********************************************************
*** SVG.Lib
***   Static SVG object manipulation functions - no state data
***
***   Usage: 
***     Call to manipulate the SVG attributes of an <svg> element in the DOM
***
***   Public Interface:
***     MovePathObject(element, xOffset, yOffset)
**********************************************************/
com.SVG.Lib = function () {

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

    return {
        MovePathObject: function (pathElement, xOffset, yOffset) {
          return movePathObject(pathElement, xOffset, yOffset);
          }
    }
} ();