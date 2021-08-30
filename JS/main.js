const url='pdf.pdf';

let pdfDoc=null;

let pageNum=1, pageIsRendering=false, pageNumIsPending=null;

const scale=1.5, canvas=document.querySelector('#pdf-render'), ctx=canvas.getContext('2d');

//Render Page

const renderPage= num =>{

    pageIsRendering=true;

    pdfDoc.getPage(num).then(page =>{
       
         const viewport=page.getViewport({scale});
         canvas.width=viewport.width;
         canvas.height=viewport.height;

         const renderCtx={
             canvasContext: ctx,
             viewport
         }

         page.render(renderCtx).promise.then(()=>{
             pageIsRendering=false;

             if(pageNumIsPending!=null){
                 renderPage(pageNumIsPending);
                 pageNumIsPending=null;
             }
         });;

         document.querySelector('#page-num').textContent=num


    })

}
//
const queueRenderPage= num =>{
    if(pageIsRendering){
        pageNumIsPending=num;
    }else{
        renderPage(num);
    }
}
//Show prev page
const showPrevPage= ()=>{
    if(pageNum<=1)
        return;
    pageNum--;
    queueRenderPage(pageNum);
}

const showNextPage= ()=>{
    if(pageNum>=pdfDoc.numPages)
        return;
    pageNum++;
    queueRenderPage(pageNum);
}

//Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>{
    pdfDoc=pdfDoc_;
    
    document.querySelector('#page-count').textContent=pdfDoc.numPages;

    renderPage(pageNum)
})

document.getElementById('prev-page').addEventListener('click',showPrevPage)
document.getElementById('next-page').addEventListener('click',showNextPage)