import Controller from "sap/ui/core/mvc/Controller";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel"
import Context from "sap/ui/model/odata/v4/Context";

/**
 * @namespace febootcamp.controller
 */

export default class Page1 extends Controller {

    public onInit(): void {
        // Mock data for VizFrame
        const oData = {
            mockData: [
                { Category: "A", Value: 10 },
                { Category: "B", Value: 20 },
                { Category: "C", Value: 30 }
            ]
        };

        // Create JSON model and set it to the view
        const oModel = new JSONModel(oData);
        this.getView()!.setModel(oModel);

        this.fetchProducts();
    }

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onButtonPress(): void {
        MessageBox.confirm(
		"Nice to meet you!", {
			title: "Hello World",
		}
    );
      }

  public async fetchProducts(): Promise<any> {
    const oModel = this.getOwnerComponent()!.getModel() as ODataModel;

    if (!oModel) {
      console.error("Model 'mainService' not found. Check manifest.json.");
      return;
    }

    const oBinding = oModel.bindList("/Products");

    try {
      // Explicitly request contexts: start at 0, fetch 100 rows
      const aContexts: Context[] = await oBinding.requestContexts(0, 100);

      const aData = aContexts.map(ctx => ctx.getObject());
      const productDetail = aData.map(product => ({
        name: product.ProductName,
        units: product.UnitsInStock
      }));

      const oView = this.getView();
      if (oView) {
          oView.setModel(new JSONModel({ Products: productDetail }));
      }

      console.log(productDetail)

    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }

}