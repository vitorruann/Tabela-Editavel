import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";

import api from "../services/api";

export default function MaterialTableDemo() {
  const [state, setState] = useState({
    data: [],
  });

  useEffect(() => {
    loadHosts();
  }, []);

  async function loadHosts() {
    const response = await api.get("/lab/getHosts");
    const data = response.data.map((produt) => ({
      host: produt.hostAddress,
      name: produt.name,
      category: produt.category,
      hostLocal: produt.hostLocal,
      hostUser: produt.hostUser,
      hostPassword: produt.hostPassword,
      id: produt._id,
    }));

    setState({ data: data });
  }

  async function removeHost(id) {
    const response = await api.delete(`/lab/delete${id}`);

    console.log(response.data);
    if (response.data.deletedCount === 0) {
      alert("Erro ao remover equipamento");
    } else {
      alert("Equipamento removido com sucesso!");
    }
    loadHosts();
  }

  async function addHost(product) {
    if (!product.name) {
      alert("Valor de nome Inválido");
    } else {
      product.name = product.name.trim();

      const newProduct = {
        hostAddress: product.host,
        name: product.name,
        category: product.category,
        hostLocal: product.hostLocal,
        hostUser: product.hostUser,
        hostPassword: product.hostPassword,
      };

      const response = await api.post("/lab/create", newProduct);

      if (response.data === "Esse host já está cadastrado") {
        alert("Esse host já está cadastrado");
      } else if (response.data.errors === undefined) {
        alert("Equipamento cadastrado com sucesso!");
      } else {
        alert("Erro ao cadastrar equipamento");
      }
    }
    loadHosts();
  }

  async function updateHosts(product) {
    if (!product.host) {
      const data = {
        name: product.name,
        category: product.category,
        hostLocal: product.hostLocal,
        hostUser: product.hostUser,
        hostPassword: product.hostPassword,
        id: product.id,
      };

      const response = await api.put("/lab/update", data);
      
      if (response.data.errors === undefined) {
        alert("Equipamento cadastrado com sucesso!");
      } else {
        alert("Erro ao cadastrar equipamento");
      }

    } else {

      const data = {
        hostAddress: product.host,
        name: product.name,
        category: product.category,
        hostLocal: product.hostLocal,
        hostUser: product.hostUser,
        hostPassword: product.hostPassword,
        id: product.id,
      };

      const response = await api.put("/lab/update", data);

      if (response.data === "Esse host já está cadastrado") {
        alert("Esse host já está cadastrado");
      } else if (response.data.errors === undefined) {
        alert("Equipamento cadastrado com sucesso!");
      } else {
        alert("Erro ao cadastrar equipamento");
      }

    loadHosts();
    }
  }

  const columns = [
    { title: "Nome", field: "name" },
    {
      title: "End IP",
      field: "host",
      editComponent: (props) => (
        <input
          type="text"
          minLength="7"
          maxLength="15"
          size="15"
          pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
          className="form-control"
          id="hostAddress"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      ),
    },
    {
      title: "Categoria",
      field: "category",
      lookup: { Outros: "Outros", Gateway: "Gateway" },
    },
    { title: "Local", field: "hostLocal" },
    { title: "Usuário", field: "hostUser" },
    { title: "Senha", field: "hostPassword" },
  ];

  return (
    <MaterialTable
      title="Editable Example"
      columns={columns}
      data={state.data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.push(newData);
                addHost(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState((prevState) => {
                  const data = [...prevState.data];
                  if (data[data.indexOf(oldData)].host === newData.host) {
                    const noUpdateHost = {
                      ...newData,
                      host: "",
                    };
                    updateHosts(noUpdateHost);
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  } else {
                    updateHosts(newData);
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  }
                });
              }
            }, 600);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
              setState((prevState) => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                removeHost(oldData.id);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}
