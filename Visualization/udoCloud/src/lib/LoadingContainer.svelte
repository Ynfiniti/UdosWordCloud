<script>
	import { loadingStore } from './charts/chartUtils';
</script>

<style>
		#container{
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
		}

		#slot{
				width: 100%;
		}

		#slot.loading{
				opacity: 0;
		}

		#load{
        position: absolute;
		}

		#load.show{
				display: none;
		}

		img{
        height: 10rem;
        animation-name: rotate;
        animation-duration: 3s;
				animation-iteration-count: infinite;
				animation-timing-function: ease-in-out;
		}

    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

<div id="container">
	<div id="slot" class:loading={$loadingStore}>
		<slot></slot>
	</div>
	<div id="load" class:show={!$loadingStore}>
		<img src="/Udo.png" alt="Udo"/>
	</div>
</div>
