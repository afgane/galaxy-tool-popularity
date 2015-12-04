var Popularity = Backbone.View.extend({
    el: '#tools-container',

    initialize: function(attributes){
        this.model = new PopularityModel(_.extend(attributes, {'view':this}));
        this.listenTo(this.model, 'popularity_calculated', this.render);
        this.render();
    },
    render: function(){
        this.$el.html("Hello World");
        // console.log(this.model.get('popularity'));
    },
});

/**
* Popularity model extended
**/
var PopularityModel = Backbone.Model.extend({
    initialize: function(attributes){
        this.set('tool1s', []);
        this.set('expected_tools', 0);
        this.set('popularity', {});
        this.listenTo(this, 'tool1s_updated', this.check_tool1_completion, this);
        this.getToolList();
    },

    /**
     * Get a list of popular tools that based on the inputs to the selected dataset.
     */
    getToolList: function(){
        var self = this,
            tool1s = this.get('tool1s'),
            expected_tools = this.get('expected_tools');
        var job2Info = $.ajax( '/api/jobs/' + this.get('job2_id') );
        job2Info.done( function( response ) {
            job2Inputs = response.inputs;
            self.set('expected_tools',Object.keys(job2Inputs).length);

            // Look for ID(s) of job(s) preceeding this dataset's job
            _.each(job2Inputs, function( v, k ) {
                $.ajax( '/api/datasets/' + v.id )
                    .done( function(response){
                        hda_hash = response;
                        $.ajax( '/api/jobs/' + hda_hash.creating_job )
                            .done( function(response){
                                tool1s.push( response.tool_id );
                                self.trigger('tool1s_updated');
                        })
                })
            });
        });
    },

    check_tool1_completion: function(){
        if ( this.get('tool1s').length == this.get('expected_tools') &&
             this.get('tool1s').length > 0 ){
            this.filter_tool1s();
            this.calculate_popularity();
            this.set('expected_tools', 0);
            this.set('tool1s', []);
        }
    },

    filter_tool1s: function(){
        var self = this,
            // A list of tool IDs that are ignorred
            ignoreTools = [ 'upload1', '__SET_METADATA__' ],
            initialTools = this.get('tool1s'),
            filteredTools = [];
        // Wait for all the requests to return and filter tool IDs
        _.each( initialTools, function(tool){
            if( ignoreTools.indexOf( tool ) == -1 ){
                filteredTools.push(tool);
            }
        });
        this.set('tool1s', filteredTools)

    },

    calculate_popularity: function(){
        var tool2_id = this.get('triplet_data')['tool_names'].indexOf(this.get('tool2_name')),
            self = this,
            popularity = this.get('popularity'),
            tool1_id, key;
        _.each(this.get('tool1s'), function(tool){
            tool1_id = self.get('triplet_data')['tool_names'].indexOf(tool);
            key = tool2_id + ',' + tool1_id;
            _.each(self.get('triplet_data')['triplets'][key], function(freq, tool3){
                if( tool3 in popularity ){
                    popularity[tool3] += freq;
                } else {
                    popularity[tool3] = freq;
                }
            });
        });
        this.filter_by_datatype();
    },

    filter_by_datatype: function(){
        var self = this;
        popularity = this.get('popularity');
        self.triplet_data = this.get('triplet_data'); // Triplet data
        self.datatype_filter = this.get('datatype_filter'); // {Datatype : Tool_Name} compatibility
        self.datatype_tree = this.get('datatype_tree'); // Datatype tree with datatype hierarchy

        console.log(self.datatype_tree);

        Object.keys(popularity).forEach(function(tool3_index){
            tool3_name = self.triplet_data['tool_names'][tool3_index];
            // self.datatype_tree[tool3_name]
            console.log(tool3_index, tool3_name, self.datatype_filter[self.get('hda_datatype')]);
            if (($.inArray(tool3_name, self.datatype_filter[self.get('hda_datatype')])) == -1){
                delete(popularity[tool3_index]);
            }
        });

        // Rescale popularity frequencies
        self.total = 0;
        Object.keys(popularity).forEach(function(key){
            self.total += popularity[key];
        });

        Object.keys(popularity).forEach(function(key){
            popularity[key] = popularity[key]/self.total;
        });
        self.trigger('popularity_calculated');
    },
});
