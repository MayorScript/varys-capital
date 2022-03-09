"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const parser = require("@solidity-parser/parser");
var multer = require("multer");
var upload = multer();
app.use(express_1.default.json()); //Used to parse JSON bodies
app.use(express_1.default.urlencoded()); //Parse URL-encoded bodies
app.use(upload.array()); // Used to parse multipart/formdata
app.use(express_1.default.static("public"));
app.post("/analyze", (req, res) => {
    const { solidityCode } = req.body;
    try {
        const parsedCode = parser.parse(solidityCode);
        let importResult = [];
        parsedCode.children.map((child) => {
            if (child.type === 'ImportDirective' && child.path) {
                importResult.push(child.path);
            }
        });
        let contractResult = [];
        parsedCode.children.map((child) => {
            if (child.type === "ContractDefinition" && child.name) {
                contractResult.push(child.name);
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
