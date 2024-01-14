class Coffee {
    constructor(name) {
        this.name = name;
        this.coffee = [];
    }

    addCoffee(name, roast) {
        this.roast.push(new Coffee(name, roast));
    }
}

class Brand {
    constructor(name, brand) {
        this.name = name;
        this.roast = brand;
    }
}

class CoffeeService{
    static url = 'https://071f727b-c852-4696-a755-e3bc735cd578.mock.pstmn.io';

    static getAllCoffee () {
        return $.get(this.url);
    }

    static getCoffee(id) {
        return $.get(this.url + `/${id}`);  
    }

    static createCoffee(coffee) {
        return $.post(this.url, coffee);
    }

    static updateCoffee(coffee) {
        return $.ajax({
            url: this.url + `/${coffee._id}`,
            dataType: 'json',
            data: JSON.stringify(coffee),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCoffee(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static coffee;

    static getAllCoffee() {
        CoffeeService.getAllCoffee().then(coffee => this.render(coffee));
    }

    static createCoffee(name) {
        CoffeeService.createCoffee(new Coffee(name))
        .then(() => {
            return CoffeeService.getAllCoffee();
        }) 
        .then ((coffees) => this.render(coffees));
    }

    static deleteCoffee(id) {
        CoffeeService.deleteCoffee(id)
        .then(() => {
            return CoffeeService.getAllCoffee();
        })
        .then((coffees) => this.render(coffees));   
    }

    static addCoffee(id) {
        for (let coffee of this.coffees) {
            if (coffee._id == id) {
                coffee.brand.push(new Coffee($(`#${coffee._id}-coffee-name`).val(), $(`#${coffee._id}-coffee-brand`).val()));
                CoffeeService.updateCoffee(coffee) 
                .then(() => {
                    return CoffeeService.getAllCoffee();
                })
                .then((coffees) => this.render(coffees));
            }
        }
    }

    static deleteBrand(coffeeId, brandId) {
        for (let coffee of this.coffees) {
            if (coffee._id == coffeeId) {
                for (let coffee of coffee.brand) {
                    if (coffeeBrand._id == brandId) {
                        coffee.brand.splice(coffee.brand.indexOf(coffeeBrand), 1);
                        CoffeeService.updateCoffee(coffee)
                        .then(() => {
                            return CoffeeService.getAllCoffee();
                        })
                        .then((coffee) => this.render(coffees));
                    }
                }
            }
        }
    }

    static render(coffees) {
        this.coffees = coffees;
        $('#app').empty();
        for (let coffee of coffees) {
            $('#app').prepend(
                `<div id="$(house._id)" class="card">
                  <div class="card-header">
                   <h2>${coffee.name}</h2>
                   <button class="btn btn-danger" onclick="DOMManger.deleteCoffee('${coffee._id}')">Delete</button>
                  </div>
                  <div class="card-body">
                   <div class="card">
                    <div class="row">
                        <div class="col-sm">
                        <input type="text" id="${coffee._id}"-coffee-name" class="form=control" placeholder="Coffee Name">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${coffee._id}"-coffee-brand" class="form=control" placeholder="Coffee Brand">
                        </div>
                    </div>
                    <button id="${coffee._id}-new-coffee" onclick="DOMManager.addCoffee('${coffee._id}')" class="btn btn-primary form-control">Add</button>
                  </div>
                </div>
            </div><br>`
            );
            for (let brand of coffee.brands) {
                $(`#${coffee._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${coffee._id}"><strong>Name: </strong> ${coffee.name} </span>
                    <span id="brand-${coffee._id}"><strong>Brand: </strong> ${coffee.brand} </span>
                    <button class="btn btn-danger" onclick= "DOMManger.deleteBrand('${coffee._id}', '${brand._id}')">Delete Brand</button>`
                );
            }
        }
    }

}

$('#create-new-coffee').click(() => {
    DOMManager.createCoffee($('new-coffee-name').val());
    $('#new-coffee-name').val('');
});

DOMManager.getAllCoffee();