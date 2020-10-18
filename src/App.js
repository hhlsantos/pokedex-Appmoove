import React, { useState, useEffect } from 'react';
import './App.css';
import axios from "axios"
import { Button, List, Avatar} from 'antd';
import 'antd/dist/antd.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import { Gradient } from 'react-gradient';
 
const gradients = [
    ['#81D4FA', '#78909C', '#78909C', '#78909C', '#78909C'],
];
/*####################################################################################################################*/

//função principal
function App() {
    
    const [pokemon, setPokemon] = useState(1);
    const [pokemonData, setPokemonData] = useState([]);
    const [mesmoTipo, setMesmoTipo] = useState([]);
    const [mesmoTipo2, setMesmoTipo2] = useState([]);
    const [allNamess, setAllnNames] = useState([])
    const [allNamessObj, setAllnNamesObj] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [tipo, setTipo] = useState()
    const [listaDisponivel, setListaDisponivel] = useState([]);

/*####################################################################################################################*/

//funções que definem caracteristicas da modal
//OBS: tudo isso é disponibilizado pelo material.ui

    function rand() {
        return Math.round(Math.random() * 20) - 10;
    }
  
    function getModalStyle() {
        const top = 50 + rand();
        const left = 50 + rand();
  
        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }
  
    const useStyles = makeStyles((theme) => ({
        paper: {
            fontFamily: 'Press Start 2P', 
            alignContent: "center",
            position: 'absolute',
            width: "60%",
            height: "60%",
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));

/*####################################################################################################################*/

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] =   useState(false);

    //função que define qual lista vai ser rederizada
    const defineLista = (slot) => {
        if(slot === 0){
            setListaDisponivel(mesmoTipo)
        }
        if(slot === 1){
            setListaDisponivel(mesmoTipo2)
            
        }
        //chama função que abre modal
        handleOpen()
    }

/*####################################################################################################################*/

    //abrir modal
    const handleOpen = () => {
        //chama função para definir lista
        setOpen(true);
    };

/*####################################################################################################################*/

    //fechar modal
    const handleClose = () => {
        setOpen(false);
    };


/*####################################################################################################################*/
    //função que lista todos os pokemons do mesmo tipo

    function listModalN (allNamesPoke, tipoo, listaTipos) {
        
        const allNames = [];
        const allNames2 = [];
        allNamesPoke.map((item)=>{
            axios
                .get(`https://pokeapi.co/api/v2/pokemon/${item}`)
                    .then((res) => {
                        if(String(res.data.types[0].type.name) === listaTipos[0][0]){
                            allNames.push(res.data);
                        }
                        if(res.data.types[1] != undefined){
                            if(String(res.data.types[1].type.name) === listaTipos[0][0]){
                                allNames.push(res.data);
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        })
        setMesmoTipo(allNames)

        //verifica se ha mais um tipo, e pesquisa todos desse tipo tambem
        if(listaTipos[0][1] != undefined){
            allNamesPoke.map((item)=>{
            
                axios
                    .get(`https://pokeapi.co/api/v2/pokemon/${item}`)
                        .then((res) => {
                            if(String(res.data.types[0].type.name) === listaTipos[0][1]){
                                allNames2.push(res.data);
                            }
                            if(res.data.types[1] !== undefined){
                                if(String(res.data.types[1].type.name) === listaTipos[0][1]){
                                    allNames2.push(res.data);
                                }
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })
            })
            setMesmoTipo2(allNames2)
        }
    }

/*####################################################################################################################*/

    //Função que busca todos os nomes de pokemons para ser usado no autocomplete
    const buscaNomes = async () => {
        const allNames = [];
        axios
            .get("https://pokeapi.co/api/v2/pokemon/?limit=893")
                .then((res) => {
                    setAllnNamesObj(res.data.results)
                    allNames.push(res.data);
                    setAllnNames([])
                    allNames.map((item) => {
                        setAllnNames(item.results.map(value => value.name))
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
    }
    //executa a função somente uma vez no inicio 
    useEffect(buscaNomes, [])

/*####################################################################################################################*/

    //função para buscar pokemon escolhido
    const buscarPokemon = async () => {
        const listaTipos = [];
        const listModal = [];
        const dados = [];
        const tipoo =[];
        axios
        .get(`https://pokeapi.co/api/v2/pokemon/${document.getElementById("nome").value}`)
            .then((res) => {
                dados.push(res.data);
                setPokemonData(dados);
                setTipo(res.data.types[0].type.name)
                tipoo.push(res.data.types[0].type.name)
                
                //pega os tipos do pokemon
                listaTipos.push(res.data.types.map(value => value.type.name))
            })
            .catch((err) => {
                console.log(err);
            })
        
        
        const allNames = [];
        axios
            //pega todos os pokemons com suas informações
            .get("https://pokeapi.co/api/v2/pokemon/?limit=893")
                .then((res) => {
                    allNames.push(res.data);
                    allNames.map((item) => {
                    listModal.push(item.results.map(value => value.name))
                    });

                    //chama função que lista os pokemons por tipo
                    listModalN(listModal[0],tipoo,listaTipos)
                })
                .catch((err) => {
                    console.log(err);
            })
    }

/*####################################################################################################################*/

    //função para buscar pokemon escolhido da lista de tipos
    const buscarPokemonLi = async (nomePassado) => {
        const listaTipos = [];
        const listModal = [];
        const dados = [];
        const tipoo =[];
        axios
        .get(`https://pokeapi.co/api/v2/pokemon/${nomePassado}`)
            .then((res) => {
                dados.push(res.data);
                setPokemonData(dados);
                setTipo(res.data.types[0].type.name)
                tipoo.push(res.data.types[0].type.name)
                
                //pega os tipos do pokemon
                listaTipos.push(res.data.types.map(value => value.type.name))
            })
            .catch((err) => {
                console.log(err);
            })
        
        
        const allNames = [];
        axios
            //pega todos os pokemons com suas informações
            .get("https://pokeapi.co/api/v2/pokemon/?limit=893")
                .then((res) => {
                    allNames.push(res.data);
                    allNames.map((item) => {
                    listModal.push(item.results.map(value => value.name))
                    });

                    //chama função que lista os pokemons por tipo
                    listModalN(listModal[0],tipoo,listaTipos)
                })
                .catch((err) => {
                    console.log(err);
            })
            handleClose()
    }


/*####################################################################################################################*/

    //faz a verificação se o input esta vazio
    const handleSubmit = () => {
        
        if(document.getElementById("nome").value !== ""){
            setPokemon(document.getElementById("nome").value);
            //chama a função para buscar o pekemon
            buscarPokemon()
        }
    }

/*####################################################################################################################*/
    return (
        <div className="App">
            <header className="App-header">
                <div className="inputComplete">
                    <Autocomplete
                        className="autoComplete"
                        id="nome"
                        options={allNamessObj}
                        getOptionLabel={(option) => option.name}
                        style={{ width: "60%" }}
                        renderInput={(params) => <TextField {...params} label="SEARCH POKEMON..."  id="nome" variant="outlined" className="inp"/>}
                    />
                    <Button type="primary" className="botSearch" shape="round" onClick={handleSubmit}>
                        SEARCH
                    </Button>
                    
                </div>
                .
                <div className="conteudos">
                    {pokemonData.map((data) => {
                        return (
                            <div className="container">

                                <div className="boxImg">
                                    <img src={data.sprites["front_default"]} className="imgPrincipal"/>
                                </div>

                                <Gradient
                                    gradients={ gradients }
                                    property="background"
                                    className="gradi"
                                >

                                    <div className="titulo">
                                        <h1 className={"h1"}>{data.name}</h1>
                                    </div>

                                    <div className="teste">

                                        <div className="infos">
                                            <h2>Weight: {data.weight}</h2>
                                            <h2>Height: {data.height}</h2>
                                            <h2>Hp: {data.stats[0].base_stat}</h2>
                                            <h2>Speed: {data.stats[5].base_stat}</h2>
                                        </div>

                                        <div className="infos">
                                            <h2>Attack: {data.stats[1].base_stat}</h2>
                                            <h2>Defense: {data.stats[2].base_stat}</h2>
                                            <h2>Type</h2>

                                            <List
                                                className="listaTipos"
                                                dataSource={data.types}
                                                renderItem={tipos => (
                                                    <List.Item>
                                                        <Button type="primary" onClick={() => {defineLista(tipos.slot-1);}}>
                                                            {tipos.type.name} 
                                                        </Button>
                                                    </List.Item>
                                                )}
                                            />

                                            <Modal
                                                className="modal"
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="simple-modal-title"
                                                aria-describedby="simple-modal-description"
                                            >
                                                    
                                            <List
                                                style={modalStyle,{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}} 
                                                className={classes.paper}
                                                itemLayout="horizontal"
                                                dataSource={listaDisponivel}
                                                renderItem={item => (
                                                    <List.Item onClick={() => {buscarPokemonLi(item.name)}}>
                                                        <List.Item.Meta
                                                            avatar={<Avatar size={100} src={item.sprites["front_default"]} />}
                                                            title={<a >{item.name}</a>}
                                                        />
                                                    </List.Item>
                                                )}
                                            />
                                            </Modal>
                                        </div> 
                                    </div>
                                </Gradient>
                            </div>
                        )
                    })}
                </div>
            </header>
        </div>
    );
}

export default App;