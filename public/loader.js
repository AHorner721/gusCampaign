// load manifest.json

if('serviceWorker'in navigator){
    try{
        navigator.serviceWorker.register('sw.js');
        console.log('sw registered');
    }catch(err){
        console.log(err);
    }
}