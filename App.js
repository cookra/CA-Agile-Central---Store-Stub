Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    myFetch: [],
    myCols: [],
    dataList: [
        [1, 'FormattedID'],
        [1, 'Name'],
        [1, 'Project'],
        [1, 'Owner'],
        [1, 'CreatedDate'],
        [1, 'DisplayColor'],
        [1, 'ScheduleState'],
        [1, 'Blocked'],
        [0, 'DirectChildrenCount'],
        [0, 'Defects'],
        [1, 'Iteration'],
        [0, 'PlanEstimate'],
        [0, 'Predecessors'],
        [0, 'Successors'],
        [1, 'Release'],
        [0, 'TestCases'],
    ],
    launch: function () {
        console.log('\033[2J'); // clear the console
        for (var j = 0; j < this.dataList.length; j++) {
            if (this.dataList[j][0] === 1) {
                this.myFetch.push(this.dataList[j][1]);
                this.myCols.push(this.dataList[j][1]);
                console.log('@ _launch Filter Fetch (+) ', this.dataList[j][1]);
            }
            if (this.dataList[j][0] === 0) {
                this.myFetch.push(this.dataList[j][1]);
                console.log('@ _launch Filter Fetch (-) ', this.dataList[j][1]);
            }
        }
        this._loadData();
    },
    _getFilters: function () {
        var myFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Feature',
            operation: '=',
            value: null
        });
        return myFilter;
    },
    _loadData: function () {
        var me = this;
        var myFilters = this._getFilters();
        console.log('my filter', myFilters.toString());
        if (me.userStoryStore) {
            console.log('store exists');
            me.userStoryStore.setFilter(myFilters);
            me.userStoryStore.load();
        } else {
            console.log('creating store');
            me.userStoryStore = Ext.create('Rally.data.wsapi.artifact.Store', { // create 
                models: ['User Story', 'Defect'],
                limit: 200,
                autoLoad: true,
                filters: '',//myFilters,
                listeners: {
                    load: function (myStore, myData) {
                        console.log('got data!', myStore, myData);
                        if (!me.myGrid) {
                            me._createGrid(myStore);
                        }
                    },
                    scope: me
                },
                fetch: this.myFetch
            });
        }
    },
    _createGrid: function (myStore) {
        
        var myGrid = Ext.create('Ext.container.Container', {
            items: [{
                xtype: 'rallygrid',
                models: ['User Story', 'Defect'],

                store: myStore,
                height: '100%',
                columnCfgs: this.myCols,
            }],
            //renderTo: Ext.getBody()
        });
        this.add(myGrid);
    }
});