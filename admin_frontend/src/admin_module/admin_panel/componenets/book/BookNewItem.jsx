import { useState, useEffect } from 'react';
import CRUD_services from '../../../services/CRUD_services';
import getItemAttributes from '../../../itemAttributes';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import uploadImage from '../../../services/fileUpload'
import { bookSchema } from '../../../Joi_validation/book_validation';
import { iconSrcs } from '../../../globalVariablesAndFunctions';

const subPanelName = 'book'




export default function BookNewItem({index, reloadList, closeAddingNewItemMode}){
    
    const [newItemData, setNewItemData] = useState({_id: '', bookName: '', brief: '', author: '', category: ''});
    const [categoriesList, setcategoriesList] = useState([]);
    const [authorList, setAuthorList] = useState([]);


    useEffect(() => {
        CRUD_services.getCategories().then((list) => {
            setcategoriesList(list)
        });

        CRUD_services.getAuthors().then((list) => {
            setAuthorList(list)
        });
    }, [])
    






    const updateNewData = (attributeKey, attributeValue) => {
        const temp = {...newItemData};
        temp[attributeKey] = attributeValue;
        setNewItemData(temp);
    }

    const handleFileUpload = (url) => {
        updateNewData('photo', url);
    }


    const getAuthorFullName = () => {
        let fullname = 'Choose Author';
        authorList.forEach((author) => {
            if(author._id === newItemData.author){
                fullname = `${author.firstname} ${author.lastname}`;
            }
        });
        return fullname;
    }

    const getCategoryName = () => {
        let categoryName = 'Choose Category';
        categoriesList.forEach((category) => {
            if(category._id === newItemData.category){
                categoryName = category.categoryName;
            }
        });
        return categoryName;
    }

    const getCategoryDropDownList = () => {
        return (
            <DropdownButton
                as={ButtonGroup}
                key={'CategoryDropDownList'}
                id={'CategoryDropDownListID'}
                variant={'secondary'}
                title={getCategoryName()}
            >
                {
                    categoriesList.map((category) => <Dropdown.Item key = {category._id} eventKey="1" onClick={()=>{updateNewData('category', category._id)}} active = {newItemData.category === category._id}>{category.categoryName}</Dropdown.Item>)
                }
                
            </DropdownButton>
        )
    }


    const getAuthorDropDownList = () => {
        return (
            <DropdownButton
                as={ButtonGroup}
                key={'AuthorDropDownList'}
                id={'AuthorDropDownListID'}
                variant={'secondary'}
                title={getAuthorFullName()}
            >
                {
                    authorList.map((author) => <Dropdown.Item key = {author._id} eventKey="1" onClick={()=>{updateNewData('author', author._id)}} active = {newItemData.author === author._id}>{`${author.firstname} ${author.lastname}`}</Dropdown.Item>)
                }
                
            </DropdownButton>
        )
    }


    const addNewData = async (newItemData) => {
        const newItemDataWithoutId = {};

        getItemAttributes(subPanelName).forEach((attribute) => {
            if(attribute.key !== '_id'){
                ///Ignore the key
                newItemDataWithoutId[attribute.key] = newItemData[attribute.key];
            }
        });

        try{
            await bookSchema.validateAsync(newItemDataWithoutId)
        }catch(validationError){
            alert(`Error! \n${validationError.message}`);
            return;
        }

        try{
            const res = await CRUD_services.createBook(newItemDataWithoutId);
            if(res.status === 200){
                reloadList();
                alert('Success');
                closeAddingNewItemMode();
            }else{
                alert(res.data.message);
            }
            
        }catch(error){
            alert(error.response.data.message);
        }   
    }

    const getRepresentation = () => {
            return(
                <tr key={'newBookItem'} className="table-warning">
                    <td key={'index'} className='indexCell'>{index + 1}</td>
                    <td key={'id'} className='idCell'>New Item</td>
                    
                    <td key={'bookName'} className=''><input type="text" value={newItemData.bookName} onChange={e => updateNewData('bookName', e.target.value)} onKeyDown={(e) => {if(e.key === "Enter") addNewData(newItemData)}}/></td>
                    <td key={'brief'} className=''><input type="text" value={newItemData.brief} onChange={e => updateNewData('brief', e.target.value)} onKeyDown={(e) => {if(e.key === "Enter") addNewData(newItemData)}}/></td>
                    <td key={'photo'} className=''><input type="file" value=""  onChange={(e) => {uploadImage(e.target.files[0], handleFileUpload)}} /></td>
                    <td key={'category'} className=''>{getCategoryDropDownList()}</td>
                    <td key={'author'} className=''>{getAuthorDropDownList()}</td>
                    
                    <td className='actionButtonCell' style={{textAlign:'center'}}> 
                        <img className="hoverableImage" src={iconSrcs.save} alt="submit" width={20} onClick={() => {addNewData(newItemData)}}/>
                    </td>
                    <td className='actionButtonCell' style={{textAlign:'center'}}>
                        <img className="hoverableImage" src={iconSrcs.cancel} alt="cancel" width={20} onClick={closeAddingNewItemMode} />
                    </td>
                </tr>
            )
    }

    return (
        getRepresentation()
    );
}