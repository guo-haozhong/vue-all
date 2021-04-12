// 1.插件：挂载$store
// 2.实现Store

let Vue;

class Store {
    constructor(options) {
        this._mutations = options.mutations
        this._actions = options.actions
        this._wrappedGetters = options.getters

        const computed = {}
        this.getters = {}
        const store = this
        //{doubleCounter(state) {return state.counter * 2 }}
        Object.keys(this._wrappedGetters).forEach(key => {
            const fn = store._wrappedGetters[key]
            computed[key] = function() {
                return fn(store.state)
            }
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            })
        })

        // data响应式处理
        this._vm = new Vue({
            data: {
                $$state: options.state
            },
            computed
        })

        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)


    }

    get state() {
        return this._vm._data.$$state
    }

    set state(v) {
        console.error('please use replaceState to reset state');

    }

    commit(type, payload) {
        const entry = this._mutations[type] //筛选出type对应的函数
        if (!entry) {
            console.error('unkown mutation type');
        }

        // entry.call(this,this.state,payload)
        entry(this.state, payload)
    }

    dispatch(type, payload) {
        const entry = this._actions[type]
        if (!entry) {
            console.error('unkown action type');
        }

        entry(this, payload)
    }

}

// Vue.use
// install.apply(this, [this,...])
function install(_Vue) {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })
}

export default { Store, install };
