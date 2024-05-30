export class ResetControl { 
    onAdd(map) {
        this._map = map;    
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl';
        this._container.innerHTML =
                '<div class="reset-btn">' +
                '<button aria-label="Center map and zoom out">' +
                '<span class="mapboxgl-ctrl-icon" aria-hidden="true" title="Center map and zoom out"></span>' +
                '</button>' +
                '</div>';
        this._container.addEventListener("click", (e) => { 
            map.fire("reset")
         })
        return this._container;
        }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

export default ResetControl; 