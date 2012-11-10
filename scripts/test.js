//Import the classes we need
importClass("scripts/svg_lib.js");
importClass("scripts/svg_movable_parent.js");
importClass("scripts/svg_movable_child.js");

//Instantiate and link all the objects
window.onload = function () {
        //define the object that can be dragged
        var myTriangle = document.getElementById("myTriangle");
        //secondary element that can be dragged
        var myTriangle2 = document.getElementById("myTriangle2");
        //specify the region in which dragging should work well
        var myParent = document.getElementById("svgHost");

        var movableParent = new com.SVG.MovableParent;
        var movableTriangle = new com.SVG.MovableChild;
        var movableTriangle2 = new com.SVG.MovableChild;

        movableParent.Initalize(myParent);
        movableTriangle.Initialize(myTriangle, movableParent);
        movableTriangle2.Initialize(myTriangle2, movableParent);

        movableParent.AddChild(movableTriangle);
        movableParent.AddChild(movableTriangle2);
};