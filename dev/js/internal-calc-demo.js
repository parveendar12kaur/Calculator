(function () {

    let subTotal;
    let carsInventory = [
        {
            "carName": "models",
            "carLabel": "Model S",
            "subTotal": 80000
        },
        {
            "carName": "modelx",
            "carLabel": "Model X",
            "subTotal": 90000
        },
        {
            "carName": "model3",
            "carLabel": "Model 3",
            "subTotal": 40000
        }
    ];


    let carModelsDropDown = document.getElementById("carModels");

    // let defaultOption = document.createElement('option');
    // defaultOption.text = 'Choose your car';
    //
    // carModelsDropDown.add(defaultOption);
    carModelsDropDown.selectedIndex = 0;

    //Add the Options to the vehicles DropDownList.
    for (let i = 0; i < carsInventory.length; i++) {
        const option = document.createElement("OPTION");

        option.innerHTML = carsInventory[i].carLabel;

        option.value = JSON.stringify(carsInventory[i]);

        //Add the Option element to DropDownList.
        carModelsDropDown.options.add(option);
    }

    carModelsDropDown.addEventListener('change',function () {
        onInventoryChange(this);
    });



    // ['black', 'white', 'blue','red'].forEach((id)=>{
    //     document.getElementById(id).addEventListener('click', onInventoryChange)
    // });

    let currentOptions = ["$BT37", "$PRM31", "$IN3PB", "$DV2W", "$MDL3", "$PBSB", "$W38B", "$APPB"];

    function onInventoryChange(obj) {

        const store = window.tesla.reducerRegistry.getStore();

        if(obj.value){
            const  selectedObj = JSON.parse(obj.value);
            subTotal = selectedObj.subTotal;
        }

        if(obj.target){
            switch(obj.target.getAttribute('data-id')){
                case 'black':
                    break;
                case 'white':
                    subTotal += 1000;
                    break;
                case 'red':
                    subTotal += 2000
                    break;
                case 'blue':
                    subTotal += 3000
                    break;
            }
        }


        store.dispatch({
            type: 'CONFIGURATION_CHANGE',
            subTotal,
            currentOptions
        })
    }

    setTimeout(()=>{
        if(window.tesla.reducerRegistry){
            window.tesla.reducerRegistry.ready(() => {
                onInventoryChange(carModelsDropDown.options[0])
            })
        }
    }, 25)

})();

