var PRICE = 9.99;
var LOADNUM = 10;

new Vue({
    el: "#app",
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        search: "anime",
        lastSearch: "",
        loading: false,
        price: PRICE
    },
    computed:{
        noMoreItems: function(){
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    methods: {
        appendItems: function () {
            if (this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOADNUM);
                this.items = this.items.concat(append);
            }
        },
        addItem: function (index) {

            var item = this.items[index];
            this.total += PRICE;

            var found = false;

            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }

            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
        },
        inc: function (item) {
            item.qty++;
            this.total += PRICE;
        },
        dec: function (item) {
            item.qty--;
            this.total -= item.price;
            if (item.qty <= 0) {
                for (var i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                    }
                }
            }
        },
        onSubmit: function () {
            this.items = [];
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.search))
                .then(function (res) {
                    this.lastSearch = this.search;
                    this.results = res.data;
                    this.appendItems();
                    this.loading = false;
                });
        }
    },
    filters: {
        currency: function (price) {
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted: function () {
        this.onSubmit();

        var vueInstance = this;

        var elem = document.getElementById("product-list-bottom");
        var watcher = scrollMonitor.create(elem);

        watcher.enterViewport(function () {
            vueInstance.appendItems();
        });
    }
});