const addNodeFormContainer = document.getElementById("addNodeFormContainer");

document.getElementById("toggle-guide").addEventListener("click", function (e) {
    e.preventDefault();
    const guideContainer = document.getElementById("guideContainer");
    
    if (guideContainer.style.display === "none") {
        guideContainer.style.display = "block";
    } else {
        guideContainer.style.display = "none";
    }
});

document.getElementById("closeGuide").onclick = function() {
    document.getElementById("guideContainer").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("guideContainer")) {
        document.getElementById("guideContainer").style.display = "none";
    }
}

document.getElementById("canceleditNodeButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("editNodeFormContainer").style.display = "none";
    document.getElementById("addNodeFormContainer").style.display = "inline-block";
});

document.getElementById("inputDataButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("inputDataContainer").style.display = "inline-block";
    addNodeFormContainer.style.display = "none";
});

document.getElementById("backToCreateNodeButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("inputDataContainer").style.display = "none";
    addNodeFormContainer.style.display = "inline-block";
});

document.getElementById("submitDataButton").addEventListener("click", function (e) {
    e.preventDefault();
    processCalcProbs();
});