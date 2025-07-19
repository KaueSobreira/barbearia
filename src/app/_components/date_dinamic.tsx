import React from "react";

const DataAtual = () => {
  const data = new Date();
  const opcoes: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dataFormatada = data.toLocaleDateString("pt-BR", opcoes);

  const dataComPrimeiraMaiuscula =
    dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

  return <p className="text-sm font-semibold">{dataComPrimeiraMaiuscula}</p>;
};

export default DataAtual;
