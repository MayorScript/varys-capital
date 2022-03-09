import express, { Request, Response } from "express";

const app = express();
const parser = require("@solidity-parser/parser");

var multer = require("multer");
var upload = multer();

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(upload.array()); // Used to parse multipart/formdata
app.use(express.static("public"));

app.post("/analyze", (req:Request,res:Response) => {
  const {solidityCode} = req.body;
    try {
      const parsedCode = parser.parse(solidityCode);
        let importResult: any = [];
        parsedCode.children.map((child: any) => {
          if(child.type === 'ImportDirective' && child.path){
            importResult.push(child.path);
          }
        });
      let contractResult: any = [];
      parsedCode.children.map((child: any) => {
        if (child.type === "ContractDefinition" && child.name) {
          contractResult.push(child.name);
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