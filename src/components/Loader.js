import '../styles/loader.scss';

function Loader() {
    const loader = document.createElement('div');
    loader.innerHTML =
        '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>';
    loader.classList.add('loader');

    return loader;
}

export default Loader;
