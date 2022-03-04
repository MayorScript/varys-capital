"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const parser = require("@solidity-parser/parser");
let codeInput = `
    import "VarysContractBase.sol";
    import "VarysContractExtras.sol";
    contract VarysContract {
  mapping (uint => address) public addresses;
}
`;
app.get("/analyze", (req, res) => {
    try {
        const parsedCode = parser.parse(codeInput);
        let importResult = parsedCode.children.map((child) => {
            //   if(child.type == "ImportDirective"){ 
            //       const result = child.path.filter((element: string) => {
            //           return element !== null;
            //       });
            //       return result;
            //     }
            if (child.type == "ImportDirective") {
                const result = child.path;
                return result;
            }
        });
        let contractResult = parsedCode.children.map((child) => {
            //   if(child.type == "ContractDefinition"){
            //       const result = child.name.filter((element: string) => {
            //           return element !== null;
            //       });
            //       return result;
            //     }
            if (child.type == "ContractDefinition") {
                return child.name;
            }
        });
        res.send({
            imports: importResult,
            contracts: contractResult
        });
    }
    catch (e) {
        if (e instanceof parser.ParserError) {
            console.error(e.errors);
        }
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Application running at port ${PORT}`);
});
