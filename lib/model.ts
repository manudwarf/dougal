///<reference path="../node_modules/@types/lodash/index.d.ts" />

namespace Dougal {

  interface Attribute {
    name?: string,
    get?: Function,
    set?: Function
  }

  @Extendable
  export abstract class Model {

    attributes: any = {};
    errors: ErrorHandler;
    getters: any = {};
    setters: any = {};
    validators: ValidatorResolver[] = [];

    protected attribute(name: string, options: Attribute = {}) {
      if (options.get) {
        this.getters[name] = options.get;
      }

      if (options.set) {
        this.setters[name] = options.set;
      }

      Object.defineProperty(this, name, {
        get: () => {
          return this.get(name);
        },
        set: (value) => {
          this.set(name, value);
        }
      })
    }

    public get(key): any {
      if (this.getters[key]) {
        return this.getters[key].call(this);
      } else {
        return _.get(this.attributes, key);
      }
    }

    public set(key, value) {
      if (this.setters[key]) {
        this.setters[key].call(this, value);
      } else {
        _.set(this.attributes, key, value);
      }
      this.validate();
    }

    get valid() {
      if (!this.errors) {
        this.errors = new ErrorHandler(this);
        this.validate();
      }
      return this.errors.any();
    }

    public validate() {
      this.errors = new ErrorHandler(this);
      _.each(this.validators, (resolver: ValidatorResolver) => {
        resolver.run(this);
      });
    }

    protected validates() {
      this.validators.push(new ValidatorResolver(arguments));
    }
  }
}

window.Dougal = Dougal;