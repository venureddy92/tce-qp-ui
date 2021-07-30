import {
  Injectable,
  Compiler,
  Inject,
  NgModuleFactory,
  Type,
  ViewContainerRef,
  Injector
} from '@angular/core';
import { QUILL_TOKEN } from '../injectors/tokens';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestApiService } from '@tce/core';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class SharedComponentService {
  public imageModalOpen: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );
  public getImageData: BehaviorSubject<object> = new BehaviorSubject<object>(
    {}
  );
  public getImageData$ = this.getImageData.asObservable();
  public imageUrl = this.requestApiService.getUrl('getFile');
  public deleteImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private fibDragResponse: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private fibDragResponseClassify: BehaviorSubject<any> = new BehaviorSubject<
    any
  >(null);
  private possibleResponse: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);

  private dragId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private previewValues: BehaviorSubject<Array<any>> = new BehaviorSubject<
    Array<any>
  >([]);

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    @Inject(QUILL_TOKEN)
    private lazyEditorListing: {
      [key: string]: () => Promise<NgModuleFactory<any> | Type<any>>;
    },
    private requestApiService: RequestApiService
  ) {}

  // Loading Dynamic Module
  async importModulesAndGetComponent(ngModuleOrNgModuleFactory) {
    let moduleFactory;

    if (ngModuleOrNgModuleFactory instanceof NgModuleFactory) {
      moduleFactory = ngModuleOrNgModuleFactory;
    } else {
      moduleFactory = await this.compiler.compileModuleAsync(
        ngModuleOrNgModuleFactory
      );
    }

    const entryComponent = (<any>moduleFactory.moduleType).entry;
    const moduleRef = moduleFactory.create(this.injector);
    const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(
      entryComponent
    );
    return compFactory;
  }

  async loadDynamicEditorModule(name: string, container: ViewContainerRef) {
    const ngModuleOrNgModuleFactory = await this.lazyEditorListing[name]();
    let compFactory = await this.importModulesAndGetComponent(
      ngModuleOrNgModuleFactory
    );
    const comp = container.createComponent(compFactory);
    return comp;
  }
  // Loading Dynamic Module

  //Function to get difference between 2 arrays
  getDifferenceOfArray(array1, array2) {
    var array = [],
      diff = [];

    if (array1) {
      for (var i = 0; i < array1.length; i++) {
        array[array1[i]] = true;
      }
    }

    for (var i = 0; i < array2.length; i++) {
      if (array[array2[i]]) {
        delete array[array2[i]];
      } else {
        array[array2[i]] = true;
      }
    }

    //console.log('array123 ', array1, array2, array);

    for (var k in array) {
      diff.push(k);
    }

    return diff;
  }

  /**
   * @description To match the strings of selected strings in edit and preview mode
   * @param array1 array
   * @param array2 array
   * @param totalStrings number
   */
  getDifferenceofStrings(array1, array2, totalStrings) {
    console.log('getDifferenceofStrings ', array1, array2, totalStrings);

    var rightOptions = 0;
    array1.forEach((element, index) => {
      if (array1[index] == array2[index]) {
        rightOptions += 1;
      } else {
        rightOptions -= 1;
      }
    });
    if (totalStrings == rightOptions) {
      return true;
    } else {
      return false;
    }
  }

  imageUploadModalService(imageData) {
    if (imageData) {
      this.imageModalOpen.next(imageData);
    }
  }

  getImageDataService(imageData) {
    console.log('imageData ', imageData);

    this.getImageData.next(imageData);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  reOrderArray(array) {
    array.sort((n1, n2) => n1.value - n2.value);
  }

  sortArray(array, sort) {
    //console.log('SARRAY', array, sort);
    for (let i = array.length - 1; i > 0; i--) {
      const j = sort[i];
      [array[i], array[j]] = [array[j], array[i]];
    }
    //console.log('Sorted Array', array);
  }

  getImage(path, qId, imgName) {
    return this.imageUrl + '/' + path + '/' + qId + '/images/' + imgName;
  }

  setDeleteImageStatus(bool) {
    this.deleteImage.next(bool);
  }

  getDeleteImageStatus() {
    return this.deleteImage.asObservable();
  }

  setFibDragResponse(response) {
    this.fibDragResponse.next(response);
  }

  getFibDragResponse() {
    return this.fibDragResponse.asObservable();
  }

  getFibDragResponseClassify() {
    return this.fibDragResponseClassify.asObservable();
  }

  setFibDragResponseClassify(response) {
    this.fibDragResponseClassify.next(response);
  }

  setPossibleResponse(response) {
    this.possibleResponse.next(response);
  }

  getPossibleResponse() {
    return this.possibleResponse.asObservable();
  }

  setDragId(id) {
    this.dragId.next(id);
  }

  getDragId() {
    return this.dragId.asObservable();
  }

  setPreviewValues(values) {
    this.previewValues.next(values);
  }

  getPreviewValue() {
    return this.previewValues.asObservable();
  }
}
