import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace febootcamp.controller
 */

export default class Page2 extends Controller {

    public prevPage(): void {
      const router = UIComponent.getRouterFor(this);
      router.navTo("RoutePage1");
  }


}