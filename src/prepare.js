var start = 1;
var search = "";
var mode = 0;
// let nextBtn = document.getElementById('nextBtn');
// let prevBtn = document.getElementById('prevBtn');
//let searchText = document.getElementById('searchText');
let itemRange = document.getElementById('itemRange');

// mode 0 nextPage, mode 1 searchUser
const loadSchematics = async function (startSchem, modeInput, searchUser) {

    console.log("Schematics startAt: " + start)

    const clientOpts = {
        // wallet: {
        //     mnemonic: 'velvet timber under input escape rich gauge final submit burst glow garage',
        // },
        apps: {
            myContract: {
                contractId: '75LFKcpnX6mnz1ToWTnKrtZqTdYWyExUfixPmc4DvR6a'
            }
        }
    };
    const client = new Dash.Client(clientOpts);
    console.log('new Dash.Client');
    var documents;
    const getDocuments = async function () {
        try {
            queryOpts = {};
            if (modeInput == 0) {
                queryOpts = {
                    startAt: startSchem,
                    limit: 10,
                    orderBy: [['timestamp', 'desc']]
                };
            } else if (modeInput == 1) {
                queryOpts = {
                    where: [['username', '==', searchUser]],
                    startAt: startSchem,
                    limit: 10,
                    orderBy: [['timestamp', 'desc']]
                };
            }

            documents = await client.platform.documents.get(
                'myContract.mynfa',
                queryOpts
            );

            for (let i = 0; i < documents.length; i++) {
                console.log(documents[i].data.schematic)
                console.log(documents[i].data.date)
                console.log(documents[i].data.username)
                let strDiv = 'div' + i;
                let titleDiv = 'title' + i;
                let dateDiv = 'date' + i;
                let nameDiv = 'name' + i;

                // console.log(document.getElementById('div1').innerHTML)
                document.getElementById(strDiv).innerHTML = documents[i].data.schematic;
                document.getElementById(titleDiv).innerHTML = documents[i].data.title;
                document.getElementById(dateDiv).innerHTML = documents[i].data.date.substring(0, 10);
                document.getElementById(nameDiv).innerHTML = documents[i].data.username;

            }

            var end = Number(startSchem) + 9;
            itemRange.innerHTML = "Showing " + startSchem + " - " + end.toString();

            // console.log(documents);
            // console.log(documents[0].data.username)
            // console.log(documents[0].data.schematic)

        } catch (e) {
            console.error('Something went wrong:', e);
        } finally {
            client.disconnect();

        }
    };

    await getDocuments();
    document.getElementById('status').innerHTML = "0";
    console.log("finish loading schematics")

}

const resetInputs = async function () {
    for (let i = 0; i < 10; i++) {

        let titleDiv = 'title' + i;
        let dateDiv = 'date' + i;
        let nameDiv = "name" + i;
        let strCanvas = "canvas" + i;

        document.getElementById(titleDiv).innerHTML = "";
        document.getElementById(dateDiv).innerHTML = "";
        document.getElementById(nameDiv).innerHTML = "";

        let canvas = document.getElementById(strCanvas);
        // console.dir(canvas0)
        let ctx = canvas.getContext('webgl');
        // console.dir(ctx)
        // ctx.clearColor(0,0,0,0)
        ctx.clearDepth(0)
        // ctx.clearStencil(0)
    }
}

prevBtn.addEventListener('click', async function () {
    console.log("Click Prev")

    if (start > 1) {
        prevBtn.disabled = true;
        start = start - 10;

        // reset inputs
        await resetInputs();

        await loadSchematics(start, mode, search);     // load schematics from Dash Platform and "prepare"

        window.scrollTo(0, 0);
        window.dispatchEvent(new Event('load'));    // send window.load event to render.js to draw schematics to canvas

        prevBtn.disabled = false;
    }
    // location.reload();   // reload window

    console.log("done")
}, false);



nextBtn.addEventListener('click', async function () {
    console.log("Click Next")
    nextBtn.disabled = true;
    start = start + 10;
    // location.reload();   // reload window

    // reset inputs
    await resetInputs();

    await loadSchematics(start, mode, search);     // load schematics from Dash Platform and "prepare"
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('load'));    // send window.load event to render.js to draw schematics to canvas

    nextBtn.disabled = false;
    console.log("done")
}, false);


searchBtn.addEventListener('click', async function () {
    console.log("Click Search")
    searchBtn.disabled = true;
    search = searchText.value;
    start = 1;
    mode = 1;

    // reset inputs
    await resetInputs();

    await loadSchematics(start, mode, search);     // load schematics from Dash Platform and "prepare"
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('load'));    // send window.load event to render.js to draw schematics to canvas

    searchBtn.disabled = false;
    console.log("done")


}, false);


linkExplorer.addEventListener('click', async function () {
    console.log("Click Explorer")
    searchText.value = "";

    // reset inputs
    await resetInputs();

    await loadSchematics(1, 0, "");
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('load'));    // send window.load event to render.js to draw schematics to canvas
    console.log("done")

}, false);

// auto executing method when this js file is loaded from index.html
(async function prepare() {

    await loadSchematics(1, mode, search);

})()

// console.log(document.getElementById('schem1').innerHTML)
// document.getElementById('schem1').innerHTML = "blub";
// console.log(document.getElementById('schem1').innerHTML)