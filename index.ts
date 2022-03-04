import express, { Request, Response } from "express";

const app = express();
const parser = require("@solidity-parser/parser");

let codeInput: string = `
    import "VarysContractBase.sol";
    import "VarysContractExtras.sol";
    contract VarysContract {
  mapping (uint => address) public addresses;
}
`;

app.get("/analyze", (req:Request,res:Response) => {
    try {
      const parsedCode = parser.parse(codeInput);
      let importResult = parsedCode.children.map((child: any) => {
        //   if(child.type == "ImportDirective"){ 
        //       const result = child.path.filter((element: string) => {
        //           return element !== null;
        //       });
        //       return result;
        //     }
          if(child.type == "ImportDirective"){ 
              const result = child.path;           
              return result;
            }
      });
      let contractResult = parsedCode.children.map((child: any) => {
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
       })
    } catch (e: any) {
    if (e instanceof parser.ParserError) {
        console.error(e.errors)
    }
}
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Application running at port ${PORT}`);
})