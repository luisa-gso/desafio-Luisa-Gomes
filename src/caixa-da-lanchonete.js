class CaixaDaLanchonete {
    tabelaPrecos = {
        cafe: 3.00,
        chantily: 1.50,
        suco: 6.20,
        sanduiche: 6.50,
        queijo: 2.00,
        salgado: 7.25,
        combo1: 9.50,
        combo2: 7.50
    }

    calcularValorDaCompra(metodoDePagamento, itens) {

        const resultadoValidacao = this.validacaoCompra(metodoDePagamento, itens)
        if (!resultadoValidacao.resp.validacao) return resultadoValidacao.resp.tipoValidacao

        if (itens.length === 1) return this.compraSimples(metodoDePagamento, itens).toString()
        if (itens.length > 1) return this.compraComMaisDeUmItem(metodoDePagamento, itens).toString()
    }

    compraSimples(metodoDePagamento, itens) {
        const item = itens[0].split(',');
        const nomeItem = item[0];
        const qtdItem = parseFloat(item[1]);

        let encontrado = false;
        let valorEncontrado = null;

        for (const chave in this.tabelaPrecos) {
            if (chave === nomeItem) {
                encontrado = true;
                valorEncontrado = this.tabelaPrecos[chave];
                break;
            }
        }

        if (qtdItem > 1) {
            valorEncontrado = this.compraComMultiplosItens(metodoDePagamento, item)
        }

        if (metodoDePagamento === 'dinheiro') {
            return `R$ ${this.descontoPagamentoDinheiro(valorEncontrado).replace('.', ',')}`
        }

        if (metodoDePagamento === 'credito') {
            return `R$ ${this.acrescimoPagamentoCredito(valorEncontrado).replace('.', ',')}`
        }

        if (metodoDePagamento === 'debito') {
            return `R$ ${(valorEncontrado).toFixed(2).replace('.', ',')}`
        }

    }

    compraComMaisDeUmItem(metodoDePagamento, itens) {
        let valorTotal = 0
        let valorEncontrado = 0;
        itens.map((item) => {
            const produto = item.split(',');
            const nomeProduto = produto[0];
            const qtdItem = parseFloat(produto[1]);


            for (const chave in this.tabelaPrecos) {
                if (chave === nomeProduto) {
                    valorEncontrado = this.tabelaPrecos[chave];
                }
            }

            if (qtdItem > 1) {
                valorEncontrado = this.compraComMultiplosItens(metodoDePagamento, produto)
            }

            valorTotal += valorEncontrado;

        })

        if (metodoDePagamento === 'dinheiro') {
            return `R$ ${this.descontoPagamentoDinheiro(valorTotal).replace('.', ',')}`
        }


        if (metodoDePagamento === 'credito') {
            return `R$ ${this.acrescimoPagamentoCredito(valorTotal).replace('.', ',')}`
        }

        if (metodoDePagamento === 'debito') {
            return `R$ ${(valorTotal).toFixed(2).replace('.', ',')}`
        }

        return valorTotal

    }

    compraComMultiplosItens(metodoDePagamento, item) {
        let valorTotal = 0
        const produto = item[0];
        const qtdProduto = parseFloat(item[1]);

        let precoProduto = 0;
        for (const chave in this.tabelaPrecos) {
            if (chave === produto) {
                precoProduto = this.tabelaPrecos[chave] * qtdProduto;
            }
        }

        return valorTotal += precoProduto



        // if (metodoDePagamento === 'credito') {
        //     return `R$ ${this.acrescimoPagamentoCredito(valorTotal).replace('.', ',')}`
        // }

        // if (metodoDePagamento === 'debito') {
        //     return `R$ ${(valorTotal).toFixed(2).replace('.', ',')}`
        // }

        console.log(valorTotal);
        return valorTotal
    }

    validacaoCompra(metodoDePagamento, itens) {
        let produtoExiste = false

        const metodosValidosDePagamento = ['dinheiro', 'credito', 'debito']
        const itensExtras = ['chantily', 'queijo']

        const tiposValidacao = {
            qtdInvalida: 'Quantidade inválida!',
            carrinhoVazio: 'Não há itens no carrinho de compra!',
            itemInvalido: 'Item inválido!',
            pagamentoInvalido: 'Forma de pagamento inválida!',
            itemExtra: 'Item extra não pode ser pedido sem o principal'
        }

        let resp = {
            validacao: true,
            tipoValidacao: ''
        }

        if (!itens.length) {
            resp.validacao = false,
                resp.tipoValidacao = tiposValidacao.carrinhoVazio
        }

        if (!metodosValidosDePagamento.includes(metodoDePagamento)) {
            resp.validacao = false,
                resp.tipoValidacao = tiposValidacao.pagamentoInvalido
        }

        const produtos = [];
        for (const item of itens) {
            const produto = item.split(',');
            const nomeProduto = produto[0];
            const qtdProduto = produto[1];

            produtos.push(nomeProduto)
            if (qtdProduto == 0) {
                resp.validacao = false
                resp.tipoValidacao = tiposValidacao.qtdInvalida
                break
            }

            for (const chave in this.tabelaPrecos) {
                if (chave === nomeProduto) {
                    produtoExiste = true
                }
            }

            if (!produtoExiste) {
                resp.validacao = false
                resp.tipoValidacao = tiposValidacao.itemInvalido
                break
            }

            if (itensExtras.includes(nomeProduto)) {
                resp.validacao = false
                resp.tipoValidacao = tiposValidacao.itemExtra

                produtos.map((produto) => {
                    if (nomeProduto === 'chantily' && produto === 'cafe') {
                        resp.validacao = true
                        resp.tipoValidacao = ''
                    } else if (nomeProduto === 'queijo' && produto === 'sanduiche') {
                        resp.validacao = true
                        resp.tipoValidacao = ''
                    }
                })
            }
        }

        return { resp };
    }

    descontoPagamentoDinheiro(valor) {
        return (valor - ((5 / 100) * valor)).toFixed(2)
    }

    acrescimoPagamentoCredito(valor) {
        return (valor + ((3 / 100) * valor)).toFixed(2)
    }

}

export { CaixaDaLanchonete };
