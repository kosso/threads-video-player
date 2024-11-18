// Better Videos for Threads.... 

// Remove Meta's obnoxious console message. :)
// setTimeout(() => {
//     console.clear()
// }, 1000)


// Get the height of the visible header
let _header_height
const _header = document.querySelector('#barcelona-header')
if (_header) {
    console.log('HEADER HEIGHT', _header, _header.getClientRects()[0].height)
    _header_height = _header.getClientRects()[0].height
}

const onPlay = (e) => {
    console.log('ONPLAY', e.target)
    e.target.setAttribute('hasplayed', true)
    e.target.pause()
    e.target.removeEventListener("play", onPlay)
}


const intCallback = (entries, observer) => {
    entries.forEach((entry) => {
        // console.log('ENTRY', entry)
        let elem = entry.target;
        if (entry.isIntersecting) {
            
            if (elem.nodeName === 'VIDEO') {
                console.log('%cVIDEO CAME INTO VIEW: ', 'color:orange', observer) // , elem, elem.nodeName)
                elem.autoplay = false
                elem.loop = false
                elem.setAttribute('seen', true)
                elem.addEventListener("play", onPlay)

            }
        } 

    })
}

const int_observer = new IntersectionObserver(intCallback, {
    rootMargin: `-${_header_height ? _header_height : '0'}px 0px 0px 0px`,
    threshold: 0
})


const mut_observer = new MutationObserver(mutationList =>
    mutationList.filter(m => m.type === 'childList').forEach(m => {
        m.addedNodes.forEach(node => {
            // console.log("NODE", node.nodeName)
            if (node.nodeName == 'DIV') {
                if (node.querySelectorAll('video')?.length) {
                    const v = node.querySelector('video')
                    // console.log('%cMUTATION CONTAINS VIDEO', 'color:yellow', node)
                    // console.log('VIDEO', v)
                    setTimeout(() => {
                        v.autoplay = false
                        v.loop = false
                        makeVideoBetter(v)
                    }, 1)
                    int_observer.observe(v)
                }

                // Try to remove the custom 'mute'/'close' buttons
                if (node.parentNode) {
                    const data_inst_nodes = node.parentNode.querySelectorAll('[data-instancekey]')
                    if (data_inst_nodes.length) {
                        // console.log('%cDATA-INST-NODE', 'color:lime', data_inst_nodes[0])
                        data_inst_nodes[0].remove()
                    }
                }


            }

            const dialogs = node.querySelectorAll('[role="dialog"]')
            if (dialogs.length) {
                // console.log('%cDIALOG NODES:', "color:hotpink", dialogs)
                dialogs.forEach(d => {
                    // console.log('%cDIALOG NODE:', "color:hotpink", d)
                    d.setAttribute("data-pressable-container", false) // dialog will no longer lose when clicked
                    d.removeAttribute("data-interactive-id")
                })
            }
        });
    }));
mut_observer.observe(document, { childList: true, subtree: true });

// Get initial posts .... 
getVideos(document)

function getVideos(root) {
    const videos = root.querySelectorAll("video")
    // console.log("videos", videos)
    videos.forEach(v => {
        makeVideoBetter(v)
    })

    // Try removing other things we don't need.
    const _test = root.querySelectorAll('[data-visualcompletion="ignore"]')
    _test.forEach(e => {
        const _b = e.querySelectorAll('[role="button"]')
        _b.forEach(b => {
            b.remove()
        })
    })
}

function makeVideoBetter(v) {

    // console.log('makeVideoBetter ........................')
    // console.log(v)

    // v.style = "z-index;1000;padding:0;box-sizing:border-box;border:4px solid green !important;border-radius:30px !important; overflow:hidden !important;"

    // Damn you, autoplay!!!! *shakes fist*
    if (!v.paused) {
        v.pause()
    }
    v.playsinline = true
    v.autoplay = false
    v.loop = false
    v.controls = true
    v.muted = false

    // Allow clicking the whole embed to toogle play. (Might need clicking twice due to other measures in place to stop more autoplay back after scrolling into view...)
    v.onclick = (e) => {
        console.log('CLICKED: toggle play/pause')
        e.preventDefault()
        e.stopPropagation()
        v.paused ? v.play() : v.pause()
    }

    v.onended = (e) => {
        v.currentTime = 0
        v.pause()
        v.muted = true
    }
}
