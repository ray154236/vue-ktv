<template>
        <div th:replace="~{layout/navbar}"></div>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-6">
				<h1>上傳圖片</h1>
				<form th:action="@{/photos/uploadPost}"
					enctype="multipart/form-data" method="post">
					<div class="mb-3">
						<label class="form-label">上傳圖片</label> <input
							type="text" class="form-control" aria-describedby="emailHelp">
					</div>
					<div class="mb-3">
						<label for="formFile" class="form-label">選取上傳檔案</label> <input
							class="form-control" type="file" name="photoFile" id="formFile">
					</div>
					<button type="submit" class="btn btn-primary">送出</button>
				</form>
				<button type="button" class="btn btn-outline-success">upload</button>
                <button type="button" class="btn btn-outline-danger">close</button>
			</div>
		</div>
	</div>
</template>
    
<script setup >
    
</script>
    
<style>
    
</style>