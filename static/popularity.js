var Popularity = Backbone.View.extend({
    el: '#tools-container',

    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html("Hello World");
    }
});
