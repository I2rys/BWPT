//Dependencies
const Request = require("request")
const Chalk = require("chalk")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Functions
function Initiate_A_Checker(link){
    const Dictionary = Fs.readFileSync("./dictionary.txt", "utf8").split("\n")
    var dictionary_index = 0

    Core()
    function Core(){
        Request(`${link}${Dictionary[dictionary_index]}`, function(err, res, body){
            if(err){
                console.log(`${Chalk.grey("[") + Chalk.redBright("INVALID") + Chalk.grey("]")} ${link}${Dictionary[dictionary_index]}`)
                dictionary_index += 1
                Core()
                return
            }

            if(res.statusCode == 200){
                const output_data = Fs.readFileSync("./output.txt", "utf8")

                if(output_data.length == 0){
                    Fs.writeFileSync("./output.txt", `${link}${Dictionary[dictionary_index]}`, "utf8")
                }else{
                    Fs.writeFileSync("./output.txt", `${output_data}\n${link}${Dictionary[dictionary_index]}`, "utf8")
                }

                console.log(`${Chalk.grey("[") + Chalk.greenBright("VALID") + Chalk.grey("]")} ${link}${Dictionary[dictionary_index]}`)
                dictionary_index += 1
                Core()
                return
            }else{
                console.log(`${Chalk.grey("[") + Chalk.redBright("INVALID") + Chalk.grey("]")} ${link}${Dictionary[dictionary_index]}`)
                dictionary_index += 1
                Core()
                return
            }
        })
    }
}

//Main
if(Self_Args.length == 0){
    console.log(`node index.js <links_file_path>
Example: node index.js ./test_links.txt`)
    process.exit()
}

if(!Fs.existsSync(Self_Args[0])){
    console.log(`${Chalk.grey("[") + Chalk.redBright("ERROR") + Chalk.grey("]")} Invalid links path.`)
    process.exit()
}

for( i = 0;  i <= Fs.readFileSync(Self_Args[0], "utf8").split("\n").length-1; i++ ){
    Initiate_A_Checker(Fs.readFileSync(Self_Args[0], "utf8").split("\n")[i])
}
