import React, { Component } from 'react';
import FuzzySearch from 'fuzzy-search';
import styled from 'styled-components';
import imageplaceholder from './logo.svg';
import remove from './remove.svg';

const ItemsToSearch = [
    { img: 'https://storage.googleapis.com/rocky-production/storycovers/small_square_2daab7ef3c055cd2c31225388c587333.jpg', name: 'Delta Squad: The Rise of 188', genre: 'Scifi' },
    { img: 'https://storage.googleapis.com/rocky-production/storycovers/small_square_89a2049156d4b303b8f533710ae0854c.jpg', name: 'Fifth Avenue - The Replacements', genre: 'Scifi' },
    { name: 'The Pride', genre: 'Scifi' },
    { name: 'Awakened: Book One of the Mind Agents Series', genre: 'Scifi' },
    { name: 'Human', genre: 'Scifi' },
    { name: 'Dawn of Chrysalis', genre: 'Scifi' },
    { name: 'The War of the Hybrids - Book Three - The Luna Cult Chronicles', genre: 'Scifi' },
    { name: 'Darkest Secrets', genre: 'Scifi' },
    { name: 'In Your Memory (Slaves of Dying Book 1)', genre: 'Scifi' },
    { name: 'Roxalana', genre: 'Scifi' },
    { name: 'The Quantum Irregulars', genre: 'Scifi' },
    { name: 'Frontier Rats - Quest for Ratopia', genre: 'Scifi' },
    { name: 'The Boy Who Dreamt of a Thousand Horses', genre: 'Scifi' },
    { name: 'ANIMALYPSE', genre: 'Scifi' },
    { name: 'They Who from the Heavens Came (The Wisdom, #1)', genre: 'Scifi' },
    { name: 'Death Leaders (Book 1)', genre: 'Scifi' },
    { name: 'Book Two: The Moon Will Fall', genre: 'Scifi' },
    { img: 'https://storage.googleapis.com/rocky-production/storycovers/small_square_252792e74b5da6179505f39a29aee601.jpg', name: 'One Love: The looking Glass', genre: 'Romance' },
];
const Container = styled.div`
    display: flex;
    flex-direction: column;
    font-family: 'Helvetica';
`;
const SearchInputContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    vertical-align: middle;
    align-items:center;
    padding: 9px;
    text-align: center;
    transition: 0.4s;
    `;
const SearchIcon = styled.svg`
    position: relative;
    left: 38px;
    margin: 5px;
    height: 20px;
    width: 25px;
`;
const SearchInput = styled.input`
    padding: 9px;
    padding-left: 37px;
    padding-right: 30px;
    transition: 1s;
    border: none;
    box-shadow: inset 0 1px 2px rgba(0,0,0,.39), 0 -1px 1px #FFF, 0 1px 0 #FFF;
  `;
const ResultsContainer = styled.div`
    flex: 1;
    overflox-y: scroll;
`;
const ResultItem = styled.div`
    height: 100px;
    min-width: 35vw;
    @media (max-width: 550px) {
        min-width: 75%;
    }
    padding: 9px;
    margin: 4px;
    font-size: 1.1em;
    display: flex;
    justify-content: center;
    vertical-align: middle;
    align-items:center;
    &:active{
        background-color: rgb(20,142,130);
    }
    color: #222;
`;
const SelectedResultItem = ResultItem.extend`
    background-color: rgb(20,142,130);
    &:active{
        background-color: white;
    }
    color: white;
`;
const ResultText = styled.div`
    flex: 1;
`;
const ResultImage = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 100%;
`;
const Genre = styled.div`
    font-size: 0.7em;
`;
const CancelIcon = styled.img`
    margin: 10px;
    width: 12px;
    height: 12px;
    &:active{
        transform: scale(0.8,0.8);
    }
    position: relative;
    right: 30px;
`;
const CancelIconSpace = styled.div`
    margin: 10px;
    width: 12px;
    height: 12px;
    position: relative;
    right: 30px;
`;

export default class SearchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: 0,
      searchText: '',
      resultItems: [],
      resultCache: {},
    };
    this.searchInputChange = this.searchInputChange.bind(this);
    this.inputKeyDown = this.inputKeyDown.bind(this);
  }
  searchInputChange(e) {
    e.preventDefault();
    // if resultCache has the result, use it instead of search again
    if (e.target.value && this.state.resultCache[e.target.value]) {
        this.setState({
            resultItems: this.state.resultCache[e.target.value],
            searchText: e.target.value,
            selectedItem: 0,
          });
    } else {
        const searcher = new FuzzySearch(ItemsToSearch, ['name', 'genre'], {
        caseSensitive: false,
        });
        const result = searcher.search(e.target.value);

        const resultCache = {};
        resultCache[e.target.value] = result;
        const newResultCache = Object.assign({}, this.state.resultCache, resultCache);
        if (this.state.resultCache.length > 200) {
            this.setState({
                resultCache: [],
            });
        }
        this.setState({
            resultCache: newResultCache,
            searchText: e.target.value,
            selectedItem: 0,
        });
        if (!e.target.value) {
            this.setState({
                resultItems: [],
                searchText: '',
            });
        } else {
            // fake network latency for the first search
            setTimeout(() => {
                this.setState({
                    resultItems: result,
                });
            }, 1000);
        }
    }
  }
  inputKeyDown(e) {
    // keyboard shortcuts to navigate in results for desktop users
    switch (e.key) {
        case 'ArrowDown': {
            this.setState({
                selectedItem: (this.state.selectedItem + 1) % this.state.resultItems.length,
            });
            break;
        }
        case 'ArrowUp': {
            this.setState({
                selectedItem: (this.state.selectedItem - 1) === -1 ? this.state.resultItems.length - 1 : (this.state.selectedItem - 1),
            });
            break;
        }
        case 'Enter': {
            this.setState({
                searchText: this.state.resultItems[this.state.selectedItem].name,
            });
            break;
        }
        case 'Escape': {
            this.setState({
                searchText: '',
                resultItems: [],
            });
            break;
        }
        default:
            console.log('wrong button');
    }
    if (e.key === 'ArrowDown') {
        this.setState({
            selectedItem: (this.state.selectedItem + 1) % this.state.resultItems.length,
        });
    } else if (e.key === 'ArrowUp') {
        this.setState({
            selectedItem: (this.state.selectedItem - 1) === -1 ? this.state.resultItems.length - 1 : (this.state.selectedItem - 1),
        });
    } else if (e.key === 'Enter') {
        this.setState({
            searchText: this.state.resultItems[this.state.selectedItem].name,
        });
    } else if (e.key === 'Escape') {
        this.setState({
            searchText: '',
            resultItems: [],
        });
    }
  }
  render() {
    return (
      <Container>
        <SearchInputContainer>
          <SearchIcon height="19px" width="20px" xmlns="http://www.w3.org/2000/svg">
            <path d='M2.67 8.676c-.014 3.325 2.717 6.066 6.086 6.067 3.37.002 6.106-2.652 6.12-6.03.013-3.369-2.72-6.046-6.084-6.067-3.35-.02-6.108 2.696-6.122 6.03M20 16.886c-.521.516-1.6 1.597-2.122 2.114-.032-.029-.074-.064-.112-.102-1.098-1.086-2.196-2.17-3.29-3.26-.111-.112-.179-.128-.307-.018-.95.807-1.756 1.083-2.958 1.427-1.237.354-2.495.45-3.77.237-2.85-.477-4.982-1.98-6.386-4.472A8.086 8.086 0 0 1 .033 8.058C.29 5.092 1.717 2.818 4.257 1.25A8.262 8.262 0 0 1 9.377.03c3.168.26 5.53 1.798 7.104 4.522.609 1.054.932 2.205 1.033 3.42.163 1.959-.001 3.486-1.058 5.141-.076.119-.068.19.033.29 1.13 1.11 2.253 2.227 3.378 3.342.044.044.086.09.133.14' fillRule='evenodd'></path>
          </SearchIcon>
          <SearchInput
            placeholder="Search"
            onChange={this.searchInputChange}
            value={this.state.searchText}
            onKeyDown={this.inputKeyDown}
          />
          {this.state.searchText ? <CancelIcon src={remove} onClick={() => this.setState({ searchText: '', resultItems: [] })} /> : <CancelIconSpace />}
        </SearchInputContainer>
        <ResultsContainer>
            {this.state.resultItems.map((item, index) => {
                let imageSource = '';
                if (item.img) {
                    imageSource = item.img;
                } else {
                    imageSource = imageplaceholder;
                }
                if (index === this.state.selectedItem) {
                    return(
                        <SelectedResultItem key={item.name} onClick={() => this.setState({searchText: item.name})}>
                            <ResultImage src={imageSource} />
                            <ResultText>
                                {item.name}
                                <Genre>
                                    <br /><b>Genre:&nbsp;</b>{item.genre}
                                </Genre>
                            </ResultText>
                        </SelectedResultItem>
                    );
                }
                return(
                    <ResultItem key={item.name} onClick={() => this.setState({selectedItem: index, searchText: item.name})}>
                        <ResultImage src={imageSource} />
                        <ResultText>
                            {item.name}
                            <Genre>
                                <br /><b>Genre:&nbsp;</b>{item.genre}
                            </Genre>
                        </ResultText>
                        
                    </ResultItem>
                );
            })}
        </ResultsContainer>
      </Container>
    );
  }
}
